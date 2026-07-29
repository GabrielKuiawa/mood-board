import * as bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { publicDemoAccount } from "../constants/publicDemoAccount";
import { UserRole } from "../enum/UserRole";
import Comment from "../models/Comment";
import Folder from "../models/Folder";
import Pin from "../models/Pin";
import { User } from "../models/User";
import { ImageFile, ObjectStorage, StoredObject } from "../types/ObjectStorage";
import {
  seedAccountEmails,
  seedFolderNames,
  seedPins,
  seedUsers,
} from "./seedData";
import {
  downloadSeedImage,
  mapWithConcurrency,
  SeedImageLoader,
  uploadSeedImages,
} from "./seedImages";

export const DEFAULT_SEED_PIN_COUNT = 500;
export const DEFAULT_FOLDERS_PER_USER = 10;
const DEFAULT_UPLOAD_CONCURRENCY = 12;

const COMMENT_TEXTS = [
  "Essa composição ficou muito boa.",
  "Adorei as cores e a iluminação.",
  "Já salvei como referência!",
  "Alguém sabe onde encontro algo parecido?",
  "A perspectiva dessa imagem é incrível.",
  "Ótima inspiração para o próximo projeto.",
  "Esse detalhe fez toda a diferença.",
  "Gostei muito da ideia.",
  "A paleta de cores está perfeita.",
  "Eu usaria isso como papel de parede.",
  "Que fotografia bonita!",
  "Tem uma energia muito boa.",
] as const;

export type SeedResult = {
  users: number;
  folders: number;
  pins: number;
  comments: number;
  uploadedImages: number;
};

export type SeedOptions = {
  storage: ObjectStorage;
  imageLoader?: SeedImageLoader;
  pinCount?: number;
  foldersPerUser?: number;
  uploadConcurrency?: number;
};

function requirePositiveInteger(value: number, name: string): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${name} deve ser um número inteiro positivo.`);
  }

  return value;
}

function titleForCopy(title: string, pinIndex: number): string {
  const copyNumber = Math.floor(pinIndex / seedPins.length) + 1;
  if (copyNumber === 1) return title;

  const suffix = ` — coleção ${copyNumber}`;
  return `${title.slice(0, 150 - suffix.length)}${suffix}`;
}

async function findPreviousSeedImageUrls(
  dataSource: DataSource,
): Promise<string[]> {
  const previousUsers = await dataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.pins", "pin")
    .where("user.email IN (:...emails)", {
      emails: seedAccountEmails,
    })
    .getMany();

  return previousUsers.flatMap((user) => [
    user.getPathImageUser(),
    ...(user.pins ?? []).map((pin) => pin.getPathImage()),
  ]);
}

async function deleteUploadedObjects(
  storage: ObjectStorage,
  objects: readonly StoredObject[],
  concurrency: number,
): Promise<void> {
  await mapWithConcurrency(objects, concurrency, async (object) => {
    try {
      await storage.delete(object.key);
    } catch {
      // A limpeza é best-effort; os demais objetos ainda devem ser processados.
    }
  });
}

async function deletePreviousSeedImages(
  storage: ObjectStorage,
  urls: readonly string[],
  concurrency: number,
): Promise<void> {
  await mapWithConcurrency(urls, concurrency, async (url) => {
    try {
      await storage.deleteByUrl(url);
    } catch {
      // Uma falha isolada não deve impedir a limpeza das outras imagens.
    }
  });
}

export async function seedDatabase(
  dataSource: DataSource,
  userPassword: string,
  options: SeedOptions,
): Promise<SeedResult> {
  if (userPassword.length < 8) {
    throw new Error("SEED_USER_PASSWORD deve ter pelo menos 8 caracteres.");
  }

  const pinCount = requirePositiveInteger(
    options.pinCount ?? DEFAULT_SEED_PIN_COUNT,
    "pinCount",
  );
  const foldersPerUser = requirePositiveInteger(
    options.foldersPerUser ?? DEFAULT_FOLDERS_PER_USER,
    "foldersPerUser",
  );
  const uploadConcurrency = requirePositiveInteger(
    options.uploadConcurrency ?? DEFAULT_UPLOAD_CONCURRENCY,
    "uploadConcurrency",
  );
  if (foldersPerUser > seedFolderNames.length) {
    throw new Error(
      `foldersPerUser não pode exceder ${seedFolderNames.length}.`,
    );
  }

  const imageLoader = options.imageLoader ?? downloadSeedImage;
  const previousImageUrls = await findPreviousSeedImageUrls(dataSource);
  const uploadedObjects: StoredObject[] = [];
  const trackedStorage: ObjectStorage = {
    upload: async (file: ImageFile, folder: string): Promise<StoredObject> => {
      const object = await options.storage.upload(file, folder);
      uploadedObjects.push(object);
      return object;
    },
    delete: (key) => options.storage.delete(key),
    deleteByUrl: (url) => options.storage.deleteByUrl(url),
  };

  try {
    const pinSourceUrls = Array.from(
      { length: pinCount },
      (_, index) => seedPins[index % seedPins.length].pathImage,
    );
    const storedAvatars = await uploadSeedImages(
      seedUsers.map((user) => user.pathImageUser),
      trackedStorage,
      "seed/users",
      imageLoader,
      uploadConcurrency,
    );
    const storedPins = await uploadSeedImages(
      pinSourceUrls,
      trackedStorage,
      "seed/pins",
      imageLoader,
      uploadConcurrency,
    );
    const [passwordHash, publicDemoPasswordHash] = await Promise.all([
      bcrypt.hash(userPassword, 10),
      bcrypt.hash(publicDemoAccount.password, 10),
    ]);

    const result = await dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("email IN (:...emails)", { emails: seedAccountEmails })
        .execute();

      const users = seedUsers.map((userData, userIndex) => {
        const user = new User();

        user.setName(userData.name);
        user.setEmail(userData.email);
        user.setPathImageUser(storedAvatars[userIndex].url);
        user.setPassword(
          userData.email === publicDemoAccount.email
            ? publicDemoPasswordHash
            : passwordHash,
        );
        user.setAdmin(UserRole.USER);

        return user;
      });

      await manager.getRepository(User).save(users);

      const foldersByUser = new Map<string, Folder[]>();
      const folders = users.flatMap((user, userIndex) => {
        const userFolders = Array.from(
          { length: foldersPerUser },
          (_, folderIndex) => {
            const folder = new Folder();
            const nameIndex =
              (userIndex * foldersPerUser + folderIndex) %
              seedFolderNames.length;

            folder.setName(seedFolderNames[nameIndex]);
            folder.setUser(user);
            return folder;
          },
        );

        foldersByUser.set(user.getId(), userFolders);
        return userFolders;
      });

      await manager.getRepository(Folder).save(folders, { chunk: 100 });

      const pins = storedPins.map((storedPin, pinIndex) => {
        const pinData = seedPins[pinIndex % seedPins.length];
        const pin = new Pin();
        const owner = users[pinIndex % users.length];
        const ownerFolders = foldersByUser.get(owner.getId())!;
        const numberOfFolders = 1 + (pinIndex % 3);
        const folderOffset = pinIndex % ownerFolders.length;
        const pinFolders = Array.from(
          { length: numberOfFolders },
          (_, folderIndex) =>
            ownerFolders[(folderOffset + folderIndex) % ownerFolders.length],
        );

        pin.setTitle(titleForCopy(pinData.title, pinIndex));
        pin.setPathImage(storedPin.url);
        pin.setDescription(pinData.description);
        pin.user = owner;
        pin.setFolders(pinFolders);
        const numberOfLikes = 1 + ((pinIndex * 3) % users.length);
        for (let likeIndex = 0; likeIndex < numberOfLikes; likeIndex += 1) {
          pin.likeBy(users[(pinIndex + likeIndex + 1) % users.length]);
        }

        return pin;
      });

      await manager.getRepository(Pin).save(pins, { chunk: 100 });

      const comments = pins.flatMap((pin, pinIndex) => {
        if (pinIndex % 3 === 0) return [];

        const numberOfComments = 1 + (pinIndex % 4);
        return Array.from({ length: numberOfComments }, (_, commentIndex) => {
          const comment = new Comment();
          const authorIndex = (pinIndex + commentIndex + 2) % users.length;
          const numberOfLikes = (pinIndex + commentIndex) % 5;

          comment.setContent(
            COMMENT_TEXTS[(pinIndex + commentIndex) % COMMENT_TEXTS.length],
          );
          comment.pin = pin;
          comment.user = users[authorIndex];

          for (let likeIndex = 0; likeIndex < numberOfLikes; likeIndex += 1) {
            comment.likeBy(users[(authorIndex + likeIndex + 1) % users.length]);
          }

          return comment;
        });
      });

      await manager.getRepository(Comment).save(comments, { chunk: 100 });

      return {
        users: users.length,
        folders: folders.length,
        pins: pins.length,
        comments: comments.length,
        uploadedImages: uploadedObjects.length,
      };
    });

    await Promise.allSettled([
      deletePreviousSeedImages(
        options.storage,
        previousImageUrls,
        uploadConcurrency,
      ),
    ]);

    return result;
  } catch (error) {
    await Promise.allSettled([
      deleteUploadedObjects(
        options.storage,
        uploadedObjects,
        uploadConcurrency,
      ),
    ]);
    throw error;
  }
}
