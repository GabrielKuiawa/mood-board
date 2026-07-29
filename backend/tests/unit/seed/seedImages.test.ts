import { ObjectStorage } from "../../../src/types/ObjectStorage";
import { seedPins } from "../../../src/seed/seedData";
import {
  mapWithConcurrency,
  uploadSeedImages,
} from "../../../src/seed/seedImages";

describe("seed image helpers", () => {
  it("provides one distinct source URL for each of the 1,000 pins", () => {
    expect(seedPins).toHaveLength(1_000);
    expect(new Set(seedPins.map((pin) => pin.pathImage)).size).toBe(1_000);
  });

  it("downloads each source once and creates one stored object per item", async () => {
    let nextId = 0;
    const imageLoader = jest.fn(async () => ({
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
      contentType: "image/jpeg" as const,
      extension: "jpg" as const,
    }));
    const storage: ObjectStorage = {
      upload: jest.fn(async (_file, folder) => {
        nextId += 1;
        return {
          key: `${folder}/${nextId}.jpg`,
          url: `https://storage.example.com/${folder}/${nextId}.jpg`,
        };
      }),
      delete: jest.fn(async () => undefined),
      deleteByUrl: jest.fn(async () => true),
    };

    const stored = await uploadSeedImages(
      ["source-a", "source-b", "source-a", "source-b", "source-a"],
      storage,
      "seed/pins",
      imageLoader,
      3,
    );

    expect(imageLoader).toHaveBeenCalledTimes(2);
    expect(storage.upload).toHaveBeenCalledTimes(5);
    expect(new Set(stored.map((object) => object.key)).size).toBe(5);
  });

  it("waits for active workers to finish before reporting a failure", async () => {
    const completed: number[] = [];

    await expect(
      mapWithConcurrency([0, 1, 2, 3], 2, async (item) => {
        if (item === 0) throw new Error("upload failed");
        await Promise.resolve();
        completed.push(item);
        return item;
      }),
    ).rejects.toThrow("upload failed");

    expect(completed).toEqual([1, 2, 3]);
  });
});
