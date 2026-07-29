import ForbiddenException from "../../../src/exception/ForbiddenException";
import NotFoundException from "../../../src/exception/NotFoundException";
import { UserRole } from "../../../src/enum/UserRole";
import Folder from "../../../src/models/Folder";
import Pin from "../../../src/models/Pin";
import { User } from "../../../src/models/User";
import FolderRepository from "../../../src/repository/FolderRepository";
import PinRepository from "../../../src/repository/PinRepository";
import UserRepository from "../../../src/repository/UserRepository";
import { FolderService } from "../../../src/service/FolderService";

const FOLDER_ID = "123e4567-e89b-42d3-a456-426614174000";
const PIN_ID = "223e4567-e89b-42d3-a456-426614174000";
const OWNER_ID = "323e4567-e89b-42d3-a456-426614174000";
const OTHER_ID = "423e4567-e89b-42d3-a456-426614174000";

function setId(entity: object, id: string): void {
  Object.defineProperty(entity, "id", { value: id });
}

function createFolder(): Folder {
  const owner = new User();
  setId(owner, OWNER_ID);

  const folder = new Folder();
  setId(folder, FOLDER_ID);
  folder.setName("Referências");
  folder.setUser(owner);
  folder.pins = [];
  return folder;
}

function createPin(): Pin {
  const pin = new Pin();
  setId(pin, PIN_ID);
  return pin;
}

describe("FolderService Pin saves", () => {
  const folderRepository = {
    findOneWithUserAndPins: jest.fn(),
    save: jest.fn(),
  };
  const pinRepository = {
    findOne: jest.fn(),
  };
  const service = new FolderService(
    folderRepository as unknown as FolderRepository,
    {} as UserRepository,
    pinRepository as unknown as PinRepository,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves a Pin in a folder owned by the authenticated user", async () => {
    const folder = createFolder();
    const pin = createPin();
    folderRepository.findOneWithUserAndPins.mockResolvedValue(folder);
    pinRepository.findOne.mockResolvedValue(pin);
    folderRepository.save.mockImplementation(async (value) => value);

    const result = await service.savePin(FOLDER_ID, PIN_ID, {
      userId: OWNER_ID,
      role: UserRole.USER,
    });

    expect(result.getPins()).toEqual([pin]);
    expect(folderRepository.save).toHaveBeenCalledWith(folder);
  });

  it("does not let another user save into the owner's folder", async () => {
    folderRepository.findOneWithUserAndPins.mockResolvedValue(createFolder());

    await expect(
      service.savePin(FOLDER_ID, PIN_ID, {
        userId: OTHER_ID,
        role: UserRole.USER,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(pinRepository.findOne).not.toHaveBeenCalled();
  });

  it("removes a saved Pin from the folder", async () => {
    const folder = createFolder();
    folder.pins = [createPin()];
    folderRepository.findOneWithUserAndPins.mockResolvedValue(folder);
    folderRepository.save.mockImplementation(async (value) => value);

    await service.removePin(FOLDER_ID, PIN_ID, {
      userId: OWNER_ID,
      role: UserRole.USER,
    });

    expect(folder.getPins()).toEqual([]);
    expect(folderRepository.save).toHaveBeenCalledWith(folder);
  });

  it("rejects removing a Pin that is not in the folder", async () => {
    folderRepository.findOneWithUserAndPins.mockResolvedValue(createFolder());

    await expect(
      service.removePin(FOLDER_ID, PIN_ID, {
        userId: OWNER_ID,
        role: UserRole.USER,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
