import NotFoundException from "../exception/NotFoundException";
import { UserNotFoundException } from "../exception/UserNotFoundException";
import Folder from "../models/Folder";
import FolderRepository from "../repository/FolderRepository";
import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import {
  createPaginatedResult,
  PaginatedResult,
  PaginationParams,
} from "../types/Pagination";
import { assertOwnerOrAdmin } from "../utils/authorization";

export class FolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly userRepository: UserRepository,
    private readonly pinRepository?: PinRepository,
  ) {}

  public async saveFolder(name: string, userId: string): Promise<Folder> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new UserNotFoundException();

    const folder = new Folder();
    folder.setName(name);
    folder.setUser(user);
    return this.folderRepository.save(folder);
  }

  public async getFoldersByUserId(
    userId: string,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Folder>> {
    const [folders, total] = await this.folderRepository.findByUserIdPaginated(
      userId,
      pagination,
    );
    return createPaginatedResult(folders, total, pagination);
  }

  public async getFolderById(id: string, userId: string): Promise<Folder> {
    const folder = await this.folderRepository.findOneWithUserAndPins(id);
    if (!folder || folder.getUser().getId() !== userId) {
      throw new NotFoundException("Pasta não encontrada.");
    }
    return folder;
  }

  public async updateFolder(
    id: string,
    name: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<Folder> {
    const folder = await this.folderRepository.findOneWithUser(id);
    if (!folder) throw new NotFoundException("Pasta não encontrada.");

    assertOwnerOrAdmin(authenticatedUser, folder.getUser().getId());
    folder.setName(name);
    return this.folderRepository.save(folder);
  }

  public async deleteFolder(
    id: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    const folder = await this.folderRepository.findOneWithUser(id);
    if (!folder) throw new NotFoundException("Pasta não encontrada.");

    assertOwnerOrAdmin(authenticatedUser, folder.getUser().getId());
    await this.folderRepository.delete(id);
  }

  public async savePin(
    folderId: string,
    pinId: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<Folder> {
    const folder = await this.folderRepository.findOneWithUserAndPins(folderId);
    if (!folder) throw new NotFoundException("Pasta não encontrada.");

    assertOwnerOrAdmin(authenticatedUser, folder.getUser().getId());
    const pin = await this.getPinRepository().findOne(pinId);
    if (!pin) throw new NotFoundException("Pin não encontrado.");

    folder.addPin(pin);
    return this.folderRepository.save(folder);
  }

  public async removePin(
    folderId: string,
    pinId: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    const folder = await this.folderRepository.findOneWithUserAndPins(folderId);
    if (!folder) throw new NotFoundException("Pasta não encontrada.");

    assertOwnerOrAdmin(authenticatedUser, folder.getUser().getId());
    if (!folder.hasPin(pinId)) {
      throw new NotFoundException("O Pin não está salvo nesta pasta.");
    }

    folder.removePin(pinId);
    await this.folderRepository.save(folder);
  }

  private getPinRepository(): PinRepository {
    if (!this.pinRepository) {
      throw new Error("O repositório de Pins não foi configurado.");
    }
    return this.pinRepository;
  }
}
