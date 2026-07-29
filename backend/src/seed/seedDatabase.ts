import * as bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { publicDemoAccount } from "../constants/publicDemoAccount";
import { UserRole } from "../enum/UserRole";
import Folder from "../models/Folder";
import Pin from "../models/Pin";
import { User } from "../models/User";
import { seedFolderNames, seedPins, seedUsers } from "./seedData";

const FOLDERS_PER_USER = 6;

export type SeedResult = {
  users: number;
  folders: number;
  pins: number;
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

      return pin;
    });

    await manager.getRepository(Pin).save(pins, { chunk: 50 });

    return {
      users: users.length,
      folders: folders.length,
      pins: pins.length,
    };
  });
}
