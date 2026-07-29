import * as bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { publicDemoAccount } from "../constants/publicDemoAccount";
import { UserRole } from "../enum/UserRole";
import Comment from "../models/Comment";
import Folder from "../models/Folder";
import Pin from "../models/Pin";
import { User } from "../models/User";
import { seedFolderNames, seedPins, seedUsers } from "./seedData";

const FOLDERS_PER_USER = 6;
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
};

export async function seedDatabase(
  dataSource: DataSource,
  userPassword: string,
): Promise<SeedResult> {
  if (userPassword.length < 8) {
    throw new Error("SEED_USER_PASSWORD deve ter pelo menos 8 caracteres.");
  }

  const [passwordHash, publicDemoPasswordHash] = await Promise.all([
    bcrypt.hash(userPassword, 10),
    bcrypt.hash(publicDemoAccount.password, 10),
  ]);

  return dataSource.transaction(async (manager) => {
    const seedEmails = seedUsers.map((user) => user.email);

    await manager
      .createQueryBuilder()
      .delete()
      .from(User)
      .where("email IN (:...emails)", { emails: seedEmails })
      .execute();

    const users = seedUsers.map((userData) => {
      const user = new User();

      user.setName(userData.name);
      user.setEmail(userData.email);
      user.setPathImageUser(userData.pathImageUser);
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
        { length: FOLDERS_PER_USER },
        (_, folderIndex) => {
          const folder = new Folder();
          const nameIndex =
            (userIndex * FOLDERS_PER_USER + folderIndex) %
            seedFolderNames.length;

          folder.setName(seedFolderNames[nameIndex]);
          folder.setUser(user);
          return folder;
        },
      );

      foldersByUser.set(user.getId(), userFolders);
      return userFolders;
    });

    await manager.getRepository(Folder).save(folders);

    const pins = seedPins.map((pinData, pinIndex) => {
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

      pin.setTitle(pinData.title);
      pin.setPathImage(pinData.pathImage);
      pin.setDescription(pinData.description);
      pin.user = owner;
      pin.setFolders(pinFolders);
      const numberOfLikes = 1 + ((pinIndex * 3) % users.length);
      for (let likeIndex = 0; likeIndex < numberOfLikes; likeIndex += 1) {
        pin.likeBy(users[(pinIndex + likeIndex + 1) % users.length]);
      }

      return pin;
    });

    await manager.getRepository(Pin).save(pins, { chunk: 50 });

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

    await manager.getRepository(Comment).save(comments, { chunk: 50 });

    return {
      users: users.length,
      folders: folders.length,
      pins: pins.length,
      comments: comments.length,
    };
  });
}
