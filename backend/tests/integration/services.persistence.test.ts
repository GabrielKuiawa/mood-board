import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../../src/data-source";
import { UserRole } from "../../src/enum/UserRole";
import ForbiddenException from "../../src/exception/ForbiddenException";
import FolderRepository from "../../src/repository/FolderRepository";
import PinRepository from "../../src/repository/PinRepository";
import UserRepository from "../../src/repository/UserRepository";
import { FolderService } from "../../src/service/FolderService";
import { PinService } from "../../src/service/PinService";
import { UserService } from "../../src/service/UserService";
import {
  clearTestDatabase,
  closeTestDatabase,
  initializeTestDatabase,
} from "../helpers/database";

describe("integration between services, repositories, and MySQL", () => {
  let userService: UserService;
  let folderService: FolderService;
  let pinService: PinService;

  beforeAll(async () => {
    await initializeTestDatabase();

    const userRepository = new UserRepository();
    const folderRepository = new FolderRepository();
    const pinRepository = new PinRepository();

    userService = new UserService(userRepository);
    folderService = new FolderService(folderRepository, userRepository);
    pinService = new PinService(
      pinRepository,
      userRepository,
      folderRepository,
    );
  });

  beforeEach(clearTestDatabase);
  afterAll(closeTestDatabase);

  it("persists a user, protects the password, and authenticates with stored data", async () => {
    const user = await userService.saveUser(
      "Gabriel",
      "gabriel@example.com",
      "password123",
      "/users/gabriel.png",
    );

    const persistedUser = await new UserRepository().findOne(user.getId());
    expect(persistedUser).not.toBeNull();
    expect(persistedUser?.getEmail()).toBe("gabriel@example.com");
    expect(persistedUser?.getPassword()).not.toBe("password123");
    await expect(
      bcrypt.compare("password123", persistedUser!.getPassword()),
    ).resolves.toBe(true);

    const token = await userService.login("gabriel@example.com", "password123");
    expect(jwt.verify(token, process.env.JWT_SECRET!)).toMatchObject({
      userId: user.getId(),
      role: UserRole.USER,
    });
  });

  it("persists relationships and removes only the association when deleting a folder", async () => {
    const user = await userService.saveUser(
      "Owner",
      "owner@example.com",
      "password123",
      "/users/owner.png",
    );
    const authenticatedUser = {
      userId: user.getId(),
      role: UserRole.USER,
    };
    const folder = await folderService.saveFolder("Architecture", user.getId());
    const pin = await pinService.savePin(
      "Modern architecture",
      "/images/house.png",
      "Modern house",
      user.getId(),
      [folder.getId()],
    );

    const persistedPin = await pinService.getPinById(pin.getId());
    expect(persistedPin.getUser().getId()).toBe(user.getId());
    expect(persistedPin.getFolders()).toHaveLength(1);
    expect(persistedPin.getFolders()[0].getName()).toBe("Architecture");

    await folderService.deleteFolder(folder.getId(), authenticatedUser);

    const pinAfterFolderDeletion = await pinService.getPinById(pin.getId());
    expect(pinAfterFolderDeletion.getFolders()).toEqual([]);
    expect(await AppDataSource.getRepository("pin").count()).toBe(1);
  });

  it("rejects a folder owned by another user at the service layer", async () => {
    const owner = await userService.saveUser(
      "Owner",
      "owner@example.com",
      "password123",
      "/users/owner.png",
    );
    const other = await userService.saveUser(
      "Other",
      "other@example.com",
      "password123",
      "/users/other.png",
    );
    const folder = await folderService.saveFolder("Private", other.getId());

    await expect(
      pinService.savePin(
        "Invalid pin",
        "/images/invalid.png",
        "Invalid reference",
        owner.getId(),
        [folder.getId()],
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(await AppDataSource.getRepository("pin").count()).toBe(0);
  });
});
