import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config";
import { ImageFile, ObjectStorage, StoredObject } from "../types/ObjectStorage";

const UPLOADS_DIRECTORY = path.resolve(process.cwd(), "uploads");

export class LocalStorageService implements ObjectStorage {
  public async upload(file: ImageFile, folder: string): Promise<StoredObject> {
    const safeFolder = folder
      .split("/")
      .filter(Boolean)
      .map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ""))
      .filter(Boolean)
      .join("/");
    const filename = `${randomUUID()}.${file.extension}`;
    const relativePath = path.posix.join(safeFolder, filename);
    const destination = path.resolve(UPLOADS_DIRECTORY, relativePath);

    if (!destination.startsWith(`${UPLOADS_DIRECTORY}${path.sep}`)) {
      throw new Error("Caminho de upload local inválido.");
    }

    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.buffer, { flag: "wx" });

    return {
      key: relativePath,
      url: `${config.publicBaseUrl}/uploads/${relativePath}`,
    };
  }

  public async delete(key: string): Promise<void> {
    const destination = path.resolve(UPLOADS_DIRECTORY, key);
    if (!destination.startsWith(`${UPLOADS_DIRECTORY}${path.sep}`)) return;
    await unlink(destination).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
  }

  public async deleteByUrl(url: string): Promise<boolean> {
    const prefix = "/uploads/";
    if (!url.startsWith(prefix)) return false;
    await this.delete(decodeURIComponent(url.slice(prefix.length)));
    return true;
  }
}
