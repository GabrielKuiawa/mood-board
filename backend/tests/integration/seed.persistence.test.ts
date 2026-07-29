import * as bcrypt from "bcryptjs";
import { publicDemoAccount } from "../../src/constants/publicDemoAccount";
import { AppDataSource } from "../../src/data-source";
import Comment from "../../src/models/Comment";
import Folder from "../../src/models/Folder";
import Pin from "../../src/models/Pin";
import { User } from "../../src/models/User";
import UserRepository from "../../src/repository/UserRepository";
import { seedDatabase } from "../../src/seed/seedDatabase";
import { seedUsers } from "../../src/seed/seedData";
import {
  clearTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "../helpers/database";

describe("database seed", () => {
  beforeAll(initializeTestDatabase);
  beforeEach(clearTestDatabase);
  afterEach(clearTestDatabase);
  afterAll(closeTestDatabase);

  it("creates the demo dataset and replaces it without duplicating records", async () => {
    const password = "seed-password-123";

    await expect(seedDatabase(AppDataSource, password)).resolves.toEqual({
      users: 8,
      folders: 48,
      pins: 200,
      comments: 332,
    });

    await expect(seedDatabase(AppDataSource, password)).resolves.toEqual({
      users: 8,
      folders: 48,
      pins: 200,
      comments: 332,
    });

    await expect(AppDataSource.getRepository(User).count()).resolves.toBe(8);
    await expect(AppDataSource.getRepository(Folder).count()).resolves.toBe(48);
    await expect(AppDataSource.getRepository(Pin).count()).resolves.toBe(200);
    await expect(AppDataSource.getRepository(Comment).count()).resolves.toBe(
      332,
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
    expect(seededPin?.getLikedByUsers().length).toBeLessThanOrEqual(8);

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
  });
});
