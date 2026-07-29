import ForbiddenException from "../../../src/exception/ForbiddenException";
import NotFoundException from "../../../src/exception/NotFoundException";
import { UserNotFoundException } from "../../../src/exception/UserNotFoundException";
import { UserRole } from "../../../src/enum/UserRole";
import Folder from "../../../src/models/Folder";
import { User } from "../../../src/models/User";
import FolderRepository from "../../../src/repository/FolderRepository";
import UserRepository from "../../../src/repository/UserRepository";
import { FolderService } from "../../../src/service/FolderService";
import { AuthenticatedUser } from "../../../src/types/AuthenticatedUser";

type FolderRepositoryMock = jest.Mocked<
  Pick<
    FolderRepository,
    | "findByUserIdPaginated"
    | "findOneWithUser"
    | "findOneWithUserAndPins"
    | "save"
    | "delete"
  >
>;

type UserRepositoryMock = jest.Mocked<Pick<UserRepository, "findOne">>;

const FOLDER_ID = "123e4567-e89b-42d3-a456-426614174000";
const OWNER_ID = "223e4567-e89b-42d3-a456-426614174000";
const OTHER_USER_ID = "323e4567-e89b-42d3-a456-426614174000";
const PAGINATION = { page: 1, limit: 20, skip: 0 };

function createUser(id: string): User {
  const user = new User();
  Object.defineProperty(user, "id", { value: id });
  return user;
}

function createFolder(name: string, user: User): Folder {
  const folder = new Folder();
  folder.setName(name);
  folder.setUser(user);
  return folder;
}

describe("FolderService", () => {
  let folderRepository: FolderRepositoryMock;
  let userRepository: UserRepositoryMock;
  let folderService: FolderService;

  const owner: AuthenticatedUser = {
    userId: OWNER_ID,
    role: UserRole.USER,
  };

  const admin: AuthenticatedUser = {
    userId: OTHER_USER_ID,
    role: UserRole.ADMIN,
  };

  const otherUser: AuthenticatedUser = {
    userId: OTHER_USER_ID,
    role: UserRole.USER,
  };

  beforeEach(() => {
    folderRepository = {
      findByUserIdPaginated: jest.fn(),
      findOneWithUser: jest.fn(),
      findOneWithUserAndPins: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    folderService = new FolderService(
      folderRepository as unknown as FolderRepository,
      userRepository as unknown as UserRepository,
    );
  });

  describe("saveFolder", () => {
    it("should create and save a folder for an existing user", async () => {
      const user = createUser(OWNER_ID);
      userRepository.findOne.mockResolvedValue(user);
      folderRepository.save.mockImplementation(
        async (folder) => folder as Folder,
      );

      const result = await folderService.saveFolder("Technology", OWNER_ID);

      expect(userRepository.findOne).toHaveBeenCalledWith(OWNER_ID);
      expect(folderRepository.save).toHaveBeenCalledTimes(1);
      expect(result.getName()).toBe("Technology");
      expect(result.getUser()).toBe(user);
    });

    it("should throw when the user does not exist", async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        folderService.saveFolder("Technology", OWNER_ID),
      ).rejects.toBeInstanceOf(UserNotFoundException);

      expect(folderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("getFoldersByUserId", () => {
    it("should return only folders owned by the user", async () => {
      const folders = [createFolder("Technology", createUser(OWNER_ID))];
      folderRepository.findByUserIdPaginated.mockResolvedValue([folders, 1]);

      const result = await folderService.getFoldersByUserId(
        OWNER_ID,
        PAGINATION,
      );

      expect(result.data).toBe(folders);
      expect(folderRepository.findByUserIdPaginated).toHaveBeenCalledWith(
        OWNER_ID,
        PAGINATION,
      );
    });
  });

  describe("getFolderById", () => {
    it("should return an existing folder by id", async () => {
      const folder = createFolder("Technology", createUser(OWNER_ID));
      folderRepository.findOneWithUserAndPins.mockResolvedValue(folder);

      const result = await folderService.getFolderById(FOLDER_ID, OWNER_ID);

      expect(result).toBe(folder);
      expect(folderRepository.findOneWithUserAndPins).toHaveBeenCalledWith(
        FOLDER_ID,
      );
    });

    it("should throw when the folder does not exist", async () => {
      folderRepository.findOneWithUserAndPins.mockResolvedValue(null);

      await expect(
        folderService.getFolderById(FOLDER_ID, OWNER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("does not expose a folder owned by another user", async () => {
      const folder = createFolder("Private", createUser(OTHER_USER_ID));
      folderRepository.findOneWithUserAndPins.mockResolvedValue(folder);

      await expect(
        folderService.getFolderById(FOLDER_ID, OWNER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe("updateFolder", () => {
    it("should allow the owner to update the folder", async () => {
      const folder = createFolder("Old name", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);
      folderRepository.save.mockImplementation(
        async (folderToSave) => folderToSave as Folder,
      );

      const result = await folderService.updateFolder(
        FOLDER_ID,
        "New name",
        owner,
      );

      expect(folderRepository.findOneWithUser).toHaveBeenCalledWith(FOLDER_ID);
      expect(folderRepository.save).toHaveBeenCalledWith(folder);
      expect(result.getName()).toBe("New name");
    });

    it("should allow an administrator to update the folder", async () => {
      const folder = createFolder("Old name", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);
      folderRepository.save.mockImplementation(
        async (folderToSave) => folderToSave as Folder,
      );

      const result = await folderService.updateFolder(
        FOLDER_ID,
        "Admin update",
        admin,
      );

      expect(result.getName()).toBe("Admin update");
      expect(folderRepository.save).toHaveBeenCalledWith(folder);
    });

    it("should throw when the folder does not exist", async () => {
      folderRepository.findOneWithUser.mockResolvedValue(null);

      await expect(
        folderService.updateFolder(FOLDER_ID, "New name", owner),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(folderRepository.save).not.toHaveBeenCalled();
    });

    it("should forbid a user who is not the owner", async () => {
      const folder = createFolder("Old name", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);

      await expect(
        folderService.updateFolder(FOLDER_ID, "New name", otherUser),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(folder.getName()).toBe("Old name");
      expect(folderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("deleteFolder", () => {
    it("should allow the owner to delete the folder", async () => {
      const folder = createFolder("Technology", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);
      folderRepository.delete.mockResolvedValue(undefined);

      await folderService.deleteFolder(FOLDER_ID, owner);

      expect(folderRepository.delete).toHaveBeenCalledWith(FOLDER_ID);
      expect(folderRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("should allow an administrator to delete the folder", async () => {
      const folder = createFolder("Technology", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);
      folderRepository.delete.mockResolvedValue(undefined);

      await folderService.deleteFolder(FOLDER_ID, admin);

      expect(folderRepository.delete).toHaveBeenCalledWith(FOLDER_ID);
    });

    it("should throw when the folder does not exist", async () => {
      folderRepository.findOneWithUser.mockResolvedValue(null);

      await expect(
        folderService.deleteFolder(FOLDER_ID, owner),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(folderRepository.delete).not.toHaveBeenCalled();
    });

    it("should forbid a user who is not the owner", async () => {
      const folder = createFolder("Technology", createUser(OWNER_ID));
      folderRepository.findOneWithUser.mockResolvedValue(folder);

      await expect(
        folderService.deleteFolder(FOLDER_ID, otherUser),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(folderRepository.delete).not.toHaveBeenCalled();
    });
  });
});
