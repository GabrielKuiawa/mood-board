import { ImageFile, ObjectStorage, StoredObject } from "../types/ObjectStorage";

const MAX_IMAGE_SIZE = 20 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 30_000;

export type SeedImageLoader = (url: string) => Promise<ImageFile>;

function identifyImage(buffer: Buffer): Omit<ImageFile, "buffer"> {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { contentType: "image/jpeg", extension: "jpg" };
  }

  if (
    buffer.length >= 8 &&
    buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { contentType: "image/png", extension: "png" };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { contentType: "image/webp", extension: "webp" };
  }

  throw new Error("O seed recebeu um arquivo que não é JPEG, PNG ou WebP.");
}

export async function downloadSeedImage(url: string): Promise<ImageFile> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
    headers: { "user-agent": "mood-board-seeder/1.0" },
  });

  if (!response.ok) {
    throw new Error(
      `Não foi possível baixar uma imagem do seed (${response.status}).`,
    );
  }

  const contentLength = Number(response.headers.get("content-length"));
  if (contentLength > MAX_IMAGE_SIZE) {
    throw new Error("Uma imagem do seed excede o limite de 20 MB.");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_SIZE) {
    throw new Error("Uma imagem do seed está vazia ou excede 20 MB.");
  }

  return { buffer, ...identifyImage(buffer) };
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index], index);
    }
  }

  const workers = await Promise.allSettled(
    Array.from(
      { length: Math.min(Math.max(1, concurrency), items.length) },
      worker,
    ),
  );
  const failedWorker = workers.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );
  if (failedWorker) throw failedWorker.reason;

  return results;
}

export async function uploadSeedImages(
  sourceUrls: readonly string[],
  storage: ObjectStorage,
  folder: string,
  imageLoader: SeedImageLoader,
  concurrency: number,
): Promise<StoredObject[]> {
  const imageCache = new Map<string, Promise<ImageFile>>();

  return mapWithConcurrency(
    sourceUrls,
    concurrency,
    async (sourceUrl): Promise<StoredObject> => {
      let image = imageCache.get(sourceUrl);
      if (!image) {
        image = imageLoader(sourceUrl);
        imageCache.set(sourceUrl, image);
      }

      return storage.upload(await image, folder);
    },
  );
}
