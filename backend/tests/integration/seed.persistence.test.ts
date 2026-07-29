import * as bcrypt from "bcryptjs";
import { publicDemoAccount } from "../../src/constants/publicDemoAccount";
import { AppDataSource } from "../../src/data-source";
import Comment from "../../src/models/Comment";
import Folder from "../../src/models/Folder";
import Pin from "../../src/models/Pin";
import { User } from "../../src/models/User";
import { UserRole } from "../../src/enum/UserRole";
import UserRepository from "../../src/repository/UserRepository";
import { seedDatabase } from "../../src/seed/seedDatabase";
import { seedAccountEmails, seedUsers } from "../../src/seed/seedData";
import { ImageFile, ObjectStorage } from "../../src/types/ObjectStorage";
import {
  clearTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "../helpers/database";

describe("database seed", () => {
  let nextObjectId: number;
  let deletedUrls: string[];
  let storage: ObjectStorage;
  const image: ImageFile = {
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
    contentType: "image/jpeg",
    extension: "jpg",
  };

  beforeAll(initializeTestDatabase);
  beforeEach(async () => {
    await clearTestDatabase();
    nextObjectId = 0;
    deletedUrls = [];
    storage = {
      upload: async (_file, folder) => {
        nextObjectId += 1;
        const key = `test/${folder}/${nextObjectId}.jpg`;
        return {
          key,
          url: `https://storage.example.com/${key}`,
        };
      },
      delete: async () => undefined,
      deleteByUrl: async (url) => {
        deletedUrls.push(url);
        return url.startsWith("https://storage.example.com/");
      },
    };
  });
  afterEach(clearTestDatabase);
  afterAll(closeTestDatabase);

  it("creates the demo dataset and replaces it without duplicating records", async () => {
    const password = "seed-password-123";
    const retiredUser = new User();
    retiredUser.setName("Retired seed user");
    retiredUser.setEmail(seedAccountEmails[seedUsers.length]);
    retiredUser.setPathImageUser(
      "https://storage.example.com/test/seed/users/retired.jpg",
    );
    retiredUser.setPassword("retired-password-hash");
    retiredUser.setAdmin(UserRole.USER);
    await AppDataSource.getRepository(User).save(retiredUser);

    const options = {
      storage,
      imageLoader: async () => image,
    };

    await expect(
      seedDatabase(AppDataSource, password, options),
    ).resolves.toEqual({
      users: 12,
      folders: 120,
      pins: 500,
      comments: 832,
      uploadedImages: 512,
    });

    await expect(
      seedDatabase(AppDataSource, password, options),
    ).resolves.toEqual({
      users: 12,
      folders: 120,
      pins: 500,
      comments: 832,
      uploadedImages: 512,
    });

    await expect(AppDataSource.getRepository(User).count()).resolves.toBe(12);
    await expect(AppDataSource.getRepository(Folder).count()).resolves.toBe(
      120,
    );
    await expect(AppDataSource.getRepository(Pin).count()).resolves.toBe(500);
    await expect(AppDataSource.getRepository(Comment).count()).resolves.toBe(
      832,
    );
    expect(deletedUrls).toHaveLength(513);
    expect(deletedUrls).toContain(
      "https://storage.example.com/test/seed/users/retired.jpg",
    );

    const userRepository = new UserRepository();
    const demoUser = await userRepository.findOneByEmail(
      publicDemoAccount.email,
    );
    expect(demoUser).not.toBeNull();
    await expect(
      bcrypt.compare(publicDemoAccount.password, demoUser!.getPassword()),
    ).resolves.toBe(true);

    const privateSeedUser = await userRepository.findOneByEmail(
      seedUsers[1].email,
    );
    expect(privateSeedUser).not.toBeNull();
    await expect(
      bcrypt.compare(password, privateSeedUser!.getPassword()),
    ).resolves.toBe(true);

    const seededPin = await AppDataSource.getRepository(Pin).findOne({
      where: {},
      relations: { user: true, folders: true, likedByUsers: true },
    });

    expect(seededPin?.getTitle()).toEqual(expect.any(String));
    expect(seededPin?.getUser()).toBeDefined();
    expect(seededPin?.getFolders().length).toBeGreaterThanOrEqual(1);
    expect(seededPin?.getLikedByUsers().length).toBeGreaterThanOrEqual(1);
    expect(seededPin?.getLikedByUsers().length).toBeLessThanOrEqual(12);
    expect(seededPin?.getPathImage()).toMatch(
      /^https:\/\/storage\.example\.com\/test\/seed\/pins\//,
    );
    expect(demoUser?.getPathImageUser()).toMatch(
      /^https:\/\/storage\.example\.com\/test\/seed\/users\//,
    );

    const seededComments = await AppDataSource.getRepository(Comment).find({
      relations: { user: true, pin: true, likedByUsers: true },
    });
    const seededComment = seededComments[0];

    expect(seededComment?.getContent()).toEqual(expect.any(String));
    expect(seededComment?.user).toBeDefined();
    expect(seededComment?.pin).toBeDefined();
    expect(
      seededComments.some((comment) => comment.getLikedByUsers().length > 0),
    ).toBe(true);
    expect(
      Math.max(
        ...seededComments.map((comment) => comment.getLikedByUsers().length),
      ),
    ).toBeLessThanOrEqual(4);
  }, 30_000);
});
