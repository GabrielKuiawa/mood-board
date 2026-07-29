import ForbiddenException from "../../../src/exception/ForbiddenException";
import NotFoundException from "../../../src/exception/NotFoundException";
import { UserRole } from "../../../src/enum/UserRole";
import Folder from "../../../src/models/Folder";
import Pin from "../../../src/models/Pin";
import { User } from "../../../src/models/User";
import FolderRepository from "../../../src/repository/FolderRepository";
import PinRepository from "../../../src/repository/PinRepository";
import UserRepository from "../../../src/repository/UserRepository";
import { PinService } from "../../../src/service/PinService";
import { AuthenticatedUser } from "../../../src/types/AuthenticatedUser";
import { ImageFile, ObjectStorage } from "../../../src/types/ObjectStorage";

type PinRepositoryMock = jest.Mocked<
  Pick<
    PinRepository,
    | "findAllWithRelationsPaginated"
    | "searchWithRelationsPaginated"
    | "findOneWithRelations"
    | "save"
    | "delete"
  >
>;

type UserRepositoryMock = jest.Mocked<Pick<UserRepository, "findOne">>;

type FolderRepositoryMock = jest.Mocked<Pick<FolderRepository, "findByIds">>;

const PIN_ID = "123e4567-e89b-42d3-a456-426614174000";
const OWNER_ID = "223e4567-e89b-42d3-a456-426614174000";
const OTHER_USER_ID = "323e4567-e89b-42d3-a456-426614174000";
const FOLDER_ID = "423e4567-e89b-42d3-a456-426614174000";
const SECOND_FOLDER_ID = "523e4567-e89b-42d3-a456-426614174000";
const PAGINATION = { page: 1, limit: 20, skip: 0 };

function setEntityId(entity: object, id: string): void {
  Object.defineProperty(entity, "id", { value: id });
}

function createUser(id: string): User {
  const user = new User();
  setEntityId(user, id);
  return user;
}

function createFolder(id: string, name: string, user: User): Folder {
  const folder = new Folder();
  setEntityId(folder, id);
  folder.setName(name);
  folder.setUser(user);
  return folder;
}

function createPin(user: User, folders: Folder[] = []): Pin {
  const pin = new Pin();
  setEntityId(pin, PIN_ID);
  pin.setTitle("Old title");
  pin.setPathImage("/pins/old.png");
  pin.setDescription("Old description");
  pin.user = user;
  pin.setFolders(folders);
  return pin;
}

describe("PinService", () => {
  let pinRepository: PinRepositoryMock;
  let userRepository: UserRepositoryMock;
  let folderRepository: FolderRepositoryMock;
  let objectStorage: jest.Mocked<ObjectStorage>;
  let pinService: PinService;

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
    pinRepository = {
      findAllWithRelationsPaginated: jest.fn(),
      searchWithRelationsPaginated: jest.fn(),
      findOneWithRelations: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    folderRepository = {
      findByIds: jest.fn(),
    };

    objectStorage = {
      upload: jest.fn(),
      delete: jest.fn(),
      deleteByUrl: jest.fn(),
    };

    pinService = new PinService(
      pinRepository as unknown as PinRepository,
      userRepository as unknown as UserRepository,
      folderRepository as unknown as FolderRepository,
      objectStorage,
    );
  });

  describe("savePin", () => {
    it("should create and save an pin for an existing user", async () => {
      const user = createUser(OWNER_ID);
      const folder = createFolder(FOLDER_ID, "Technology", user);
      userRepository.findOne.mockResolvedValue(user);
      folderRepository.findByIds.mockResolvedValue([folder]);
      pinRepository.save.mockImplementation(async (pin) => pin as Pin);

      const result = await pinService.savePin(
        "New pin",
        "/pins/new.png",
        "New description",
        OWNER_ID,
        [FOLDER_ID],
      );

      expect(userRepository.findOne).toHaveBeenCalledWith(OWNER_ID);
      expect(folderRepository.findByIds).toHaveBeenCalledWith([FOLDER_ID]);
      expect(pinRepository.save).toHaveBeenCalledTimes(1);
      expect(result.getTitle()).toBe("New pin");
      expect(result.getPathImage()).toBe("/pins/new.png");
      expect(result.getDescription()).toBe("New description");
      expect(result.getUser()).toBe(user);
      expect(result.getFolders()).toEqual([folder]);
    });

    it("should throw when the user does not exist", async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        pinService.savePin(
          "New pin",
          "/pins/new.png",
          "New description",
          OWNER_ID,
          [FOLDER_ID],
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(folderRepository.findByIds).not.toHaveBeenCalled();
      expect(pinRepository.save).not.toHaveBeenCalled();
    });

    it("should save an pin without folders", async () => {
      const user = createUser(OWNER_ID);
      userRepository.findOne.mockResolvedValue(user);
      folderRepository.findByIds.mockResolvedValue([]);
      pinRepository.save.mockImplementation(async (pin) => pin as Pin);

      const result = await pinService.savePin(
        "New pin",
        "/pins/new.png",
        "New description",
        OWNER_ID,
        [],
      );

      expect(result.getFolders()).toEqual([]);
      expect(pinRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("createPinWithUpload", () => {
    const file: ImageFile = {
      buffer: Buffer.from("pin"),
      contentType: "image/png",
      extension: "png",
    };

    it("uploads the file and saves its public URL", async () => {
      const user = createUser(OWNER_ID);
      const folder = createFolder(FOLDER_ID, "Technology", user);
      userRepository.findOne.mockResolvedValue(user);
      folderRepository.findByIds.mockResolvedValue([folder]);
      objectStorage.upload.mockResolvedValue({
        key: `images/${OWNER_ID}/pin.png`,
        url: "https://cdn.example.com/pin.png",
      });
      pinRepository.save.mockImplementation(async (pin) => pin as Pin);

      const result = await pinService.createPinWithUpload(
        "New pin",
        "New description",
        OWNER_ID,
        [FOLDER_ID],
        file,
      );

      expect(objectStorage.upload).toHaveBeenCalledWith(
        file,
        `images/${OWNER_ID}`,
      );
      expect(result.getPathImage()).toBe("https://cdn.example.com/pin.png");
      expect(result.getFolders()).toEqual([folder]);
      expect(objectStorage.delete).not.toHaveBeenCalled();
    });

    it("does not upload when pin relationships are invalid", async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        pinService.createPinWithUpload(
          "New pin",
          "New description",
          OWNER_ID,
          [],
          file,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(objectStorage.upload).not.toHaveBeenCalled();
    });

    it("removes the uploaded object when saving to the database fails", async () => {
      const databaseError = new Error("database unavailable");
      const user = createUser(OWNER_ID);
      userRepository.findOne.mockResolvedValue(user);
      folderRepository.findByIds.mockResolvedValue([]);
      objectStorage.upload.mockResolvedValue({
        key: `images/${OWNER_ID}/pin.png`,
        url: "https://cdn.example.com/pin.png",
      });
      pinRepository.save.mockRejectedValue(databaseError);

      await expect(
        pinService.createPinWithUpload(
          "New pin",
          "New description",
          OWNER_ID,
          [],
          file,
        ),
      ).rejects.toBe(databaseError);

      expect(objectStorage.delete).toHaveBeenCalledWith(
        `images/${OWNER_ID}/pin.png`,
      );
    });
  });

  describe("getPins", () => {
    it("should return all pins with their relations", async () => {
      const pins = [createPin(createUser(OWNER_ID))];
      pinRepository.findAllWithRelationsPaginated.mockResolvedValue([pins, 1]);

      const result = await pinService.getPins(PAGINATION);

      expect(result.data).toBe(pins);
      expect(result.meta).toMatchObject({ total: 1, totalPages: 1 });
      expect(pinRepository.findAllWithRelationsPaginated).toHaveBeenCalledWith(
        PAGINATION,
      );
    });

    it("should search pins by title, folder, or user", async () => {
      const pins = [createPin(createUser(OWNER_ID))];
      const filters = { query: "architecture" };
      pinRepository.searchWithRelationsPaginated.mockResolvedValue([pins, 1]);

      const result = await pinService.getPins(PAGINATION, filters);

      expect(result.data).toBe(pins);
      expect(pinRepository.searchWithRelationsPaginated).toHaveBeenCalledWith(
        PAGINATION,
        filters,
      );
      expect(
        pinRepository.findAllWithRelationsPaginated,
      ).not.toHaveBeenCalled();
    });
  });

  describe("getPinById", () => {
    it("should return an existing pin by id", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);

      const result = await pinService.getPinById(PIN_ID);

      expect(result).toBe(pin);
      expect(pinRepository.findOneWithRelations).toHaveBeenCalledWith(PIN_ID);
    });

    it("should throw when the pin does not exist", async () => {
      pinRepository.findOneWithRelations.mockResolvedValue(null);

      await expect(pinService.getPinById(PIN_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe("updatePin", () => {
    it("should allow the owner to update the pin", async () => {
      const user = createUser(OWNER_ID);
      const folder = createFolder(FOLDER_ID, "Technology", user);
      const pin = createPin(user);
      pinRepository.findOneWithRelations.mockResolvedValue(pin);
      folderRepository.findByIds.mockResolvedValue([folder]);
      pinRepository.save.mockImplementation(
        async (imageToSave) => imageToSave as Pin,
      );

      const result = await pinService.updatePin(
        PIN_ID,
        "Updated pin",
        "/pins/updated.png",
        "Updated description",
        [FOLDER_ID],
        owner,
      );

      expect(result.getTitle()).toBe("Updated pin");
      expect(result.getPathImage()).toBe("/pins/updated.png");
      expect(result.getDescription()).toBe("Updated description");
      expect(result.getFolders()).toEqual([folder]);
      expect(pinRepository.save).toHaveBeenCalledWith(pin);
    });

    it("should allow an administrator to update the pin", async () => {
      const user = createUser(OWNER_ID);
      const pin = createPin(user);
      pinRepository.findOneWithRelations.mockResolvedValue(pin);
      folderRepository.findByIds.mockResolvedValue([]);
      pinRepository.save.mockImplementation(
        async (imageToSave) => imageToSave as Pin,
      );

      const result = await pinService.updatePin(
        PIN_ID,
        "Admin pin",
        "/pins/admin-update.png",
        "Admin update",
        [],
        admin,
      );

      expect(result.getDescription()).toBe("Admin update");
      expect(pinRepository.save).toHaveBeenCalledWith(pin);
    });

    it("should throw when the pin does not exist", async () => {
      pinRepository.findOneWithRelations.mockResolvedValue(null);

      await expect(
        pinService.updatePin(
          PIN_ID,
          "Updated pin",
          "/pins/updated.png",
          "Updated description",
          [],
          owner,
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(folderRepository.findByIds).not.toHaveBeenCalled();
      expect(pinRepository.save).not.toHaveBeenCalled();
    });

    it("should forbid a user who is not the owner", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);

      await expect(
        pinService.updatePin(
          PIN_ID,
          "Updated pin",
          "/pins/updated.png",
          "Updated description",
          [],
          otherUser,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(folderRepository.findByIds).not.toHaveBeenCalled();
      expect(pinRepository.save).not.toHaveBeenCalled();
    });
  });

  describe("deletePin", () => {
    it("should allow the owner to delete the pin", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);
      pinRepository.delete.mockResolvedValue(undefined);

      await pinService.deletePin(PIN_ID, owner);

      expect(objectStorage.deleteByUrl).toHaveBeenCalledWith("/pins/old.png");
      expect(pinRepository.delete).toHaveBeenCalledWith(PIN_ID);
      expect(pinRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("should allow an administrator to delete the pin", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);
      pinRepository.delete.mockResolvedValue(undefined);

      await pinService.deletePin(PIN_ID, admin);

      expect(objectStorage.deleteByUrl).toHaveBeenCalledWith("/pins/old.png");
      expect(pinRepository.delete).toHaveBeenCalledWith(PIN_ID);
    });

    it("does not delete the database record when storage deletion fails", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);
      objectStorage.deleteByUrl.mockRejectedValue(
        new Error("storage unavailable"),
      );

      await expect(pinService.deletePin(PIN_ID, owner)).rejects.toThrow(
        "storage unavailable",
      );

      expect(pinRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw when the pin does not exist", async () => {
      pinRepository.findOneWithRelations.mockResolvedValue(null);

      await expect(pinService.deletePin(PIN_ID, owner)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(objectStorage.deleteByUrl).not.toHaveBeenCalled();
      expect(pinRepository.delete).not.toHaveBeenCalled();
    });

    it("should forbid a user who is not the owner", async () => {
      const pin = createPin(createUser(OWNER_ID));
      pinRepository.findOneWithRelations.mockResolvedValue(pin);

      await expect(
        pinService.deletePin(PIN_ID, otherUser),
      ).rejects.toBeInstanceOf(ForbiddenException);

      expect(objectStorage.deleteByUrl).not.toHaveBeenCalled();
      expect(pinRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("getOwnedFolders", () => {
    it("should return folders owned by the user", async () => {
      const user = createUser(OWNER_ID);
      const folders = [
        createFolder(FOLDER_ID, "Technology", user),
        createFolder(SECOND_FOLDER_ID, "Art", user),
      ];
      folderRepository.findByIds.mockResolvedValue(folders);

      const result = await pinService.getOwnedFolders(
        [FOLDER_ID, SECOND_FOLDER_ID],
        OWNER_ID,
      );

      expect(result).toBe(folders);
      expect(folderRepository.findByIds).toHaveBeenCalledWith([
        FOLDER_ID,
        SECOND_FOLDER_ID,
      ]);
    });

    it("should throw when one or more folders do not exist", async () => {
      const user = createUser(OWNER_ID);
      const folder = createFolder(FOLDER_ID, "Technology", user);
      folderRepository.findByIds.mockResolvedValue([folder]);

      await expect(
        pinService.getOwnedFolders([FOLDER_ID, SECOND_FOLDER_ID], OWNER_ID),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("should forbid folders owned by another user", async () => {
      const folder = createFolder(
        FOLDER_ID,
        "Technology",
        createUser(OTHER_USER_ID),
      );
      folderRepository.findByIds.mockResolvedValue([folder]);

      await expect(
        pinService.getOwnedFolders([FOLDER_ID], OWNER_ID),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });
});
