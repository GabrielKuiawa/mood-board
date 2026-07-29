import ForbiddenException from "../exception/ForbiddenException";
import NotFoundException from "../exception/NotFoundException";
import Folder from "../models/Folder";
import Pin from "../models/Pin";
import { User } from "../models/User";
import FolderRepository from "../repository/FolderRepository";
import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { ImageFile, ObjectStorage } from "../types/ObjectStorage";
import {
  createPaginatedResult,
  PaginatedResult,
  PaginationParams,
} from "../types/Pagination";
import { PinSearchFilters } from "../types/Search";
import { assertOwnerOrAdmin } from "../utils/authorization";
import { logger } from "../utils/Logger";

const PIN_STORAGE_FOLDER = "images";

export class PinService {
  constructor(
    private readonly pinRepository: PinRepository,
    private readonly userRepository: UserRepository,
    private readonly folderRepository: FolderRepository,
    private readonly objectStorage?: ObjectStorage,
  ) {}

  public async savePin(
    title: string,
    pathImage: string,
    description: string,
    userId: string,
    folderIds: string[],
  ): Promise<Pin> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const folders = await this.getOwnedFolders(folderIds, userId);
    return this.persistPin(title, pathImage, description, user, folders);
  }

  public async createPinWithUpload(
    title: string,
    description: string,
    userId: string,
    folderIds: string[],
    file: ImageFile,
  ): Promise<Pin> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException("Usuário não encontrado");

    const folders = await this.getOwnedFolders(folderIds, userId);
    const objectStorage = this.getObjectStorage();
    const storedObject = await objectStorage.upload(
      file,
      `${PIN_STORAGE_FOLDER}/${userId}`,
    );

    try {
      return await this.persistPin(
        title,
        storedObject.url,
        description,
        user,
        folders,
      );
    } catch (error) {
      try {
        await objectStorage.delete(storedObject.key);
      } catch (cleanupError) {
        logger.error("Failed to remove image after database error", {
          objectKey: storedObject.key,
          errorMessage:
            cleanupError instanceof Error
              ? cleanupError.message
              : String(cleanupError),
        });
      }
      throw error;
    }
  }

  public async getPins(
    pagination: PaginationParams,
    filters: PinSearchFilters = {},
  ): Promise<PaginatedResult<Pin>> {
    const [pins, total] =
      filters.query || filters.target
        ? await this.pinRepository.searchWithRelationsPaginated(
            pagination,
            filters,
          )
        : await this.pinRepository.findAllWithRelationsPaginated(pagination);
    return createPaginatedResult(pins, total, pagination);
  }

  public async getPinById(id: string): Promise<Pin> {
    const pin = await this.pinRepository.findOneWithRelations(id);
    if (!pin) throw new NotFoundException("Pin não encontrado.");
    return pin;
  }

  public async updatePin(
    id: string,
    title: string,
    pathImage: string,
    description: string,
    folderIds: string[],
    authenticatedUser: AuthenticatedUser,
  ): Promise<Pin> {
    const pin = await this.pinRepository.findOneWithRelations(id);
    if (!pin) throw new NotFoundException("Pin não encontrado.");

    const ownerId = pin.getUser().getId();
    assertOwnerOrAdmin(authenticatedUser, ownerId);

    const ownerFolders = await this.getOwnedFolders(folderIds, ownerId);
    const foldersFromOtherUsers = pin
      .getFolders()
      .filter((folder) => folder.getUser().getId() !== ownerId);

    pin.setTitle(title);
    pin.setPathImage(pathImage);
    pin.setDescription(description);
    pin.setFolders([...foldersFromOtherUsers, ...ownerFolders]);
    return this.pinRepository.save(pin);
  }

  public async deletePin(
    id: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    const pin = await this.pinRepository.findOneWithRelations(id);
    if (!pin) throw new NotFoundException("Pin não encontrado.");

    assertOwnerOrAdmin(authenticatedUser, pin.getUser().getId());
    await this.getObjectStorage().deleteByUrl(pin.getPathImage());
    await this.pinRepository.delete(id);
  }

  public async getOwnedFolders(
    folderIds: string[],
    userId: string,
  ): Promise<Folder[]> {
    const folders = await this.folderRepository.findByIds(folderIds);
    if (folders.length !== folderIds.length) {
      throw new NotFoundException("Uma ou mais pastas não foram encontradas.");
    }
    if (folders.some((folder) => folder.getUser().getId() !== userId)) {
      throw new ForbiddenException(
        "Você só pode utilizar suas próprias pastas.",
      );
    }
    return folders;
  }

  private async persistPin(
    title: string,
    pathImage: string,
    description: string,
    user: User,
    folders: Folder[],
  ): Promise<Pin> {
    const pin = new Pin();
    pin.setTitle(title);
    pin.setPathImage(pathImage);
    pin.setDescription(description);
    pin.user = user;
    folders.forEach((folder) => pin.addFolder(folder));
    return this.pinRepository.save(pin);
  }

  private getObjectStorage(): ObjectStorage {
    if (!this.objectStorage) {
      throw new Error("O serviço de armazenamento não foi configurado.");
    }
    return this.objectStorage;
  }
}
