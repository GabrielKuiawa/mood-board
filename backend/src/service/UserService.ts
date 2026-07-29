import { UserRole } from "../enum/UserRole";
import { publicDemoAccount } from "../constants/publicDemoAccount";
import ConflictException from "../exception/ConflictException";
import UnauthorizedException from "../exception/UnauthorizedException";
import { UserNotFoundException } from "../exception/UserNotFoundException";
import { User } from "../models/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import UserRepository from "../repository/UserRepository";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { assertOwnerOrAdmin } from "../utils/authorization";
import { config } from "../config";
import Pin from "../models/Pin";
import {
  createPaginatedResult,
  PaginatedResult,
  PaginationParams,
} from "../types/Pagination";
import { ImageFile, ObjectStorage } from "../types/ObjectStorage";
import { logger } from "../utils/Logger";

const DUMMY_PASSWORD_HASH =
  "$2a$10$0Z2gC9QmZZ.P7WYRyuKHlexJzZ5b8WsyMqBQlqlf1nOrdeSgo7WrC";
const USER_IMAGE_FOLDER = "users";

export class UserService {
  private userRepository: UserRepository;
  private objectStorage?: ObjectStorage;

  constructor(userRepository: UserRepository, objectStorage?: ObjectStorage) {
    this.userRepository = userRepository;
    this.objectStorage = objectStorage;
  }

  public async saveUser(
    name: string,
    email: string,
    password: string,
    pathImageUser: string,
  ): Promise<User> {
    if (await this.userRepository.findOneByEmail(email)) {
      throw new ConflictException("Email já está em uso.");
    }

    const newUser = new User();
    newUser.setName(name);
    newUser.setEmail(email);
    newUser.setPassword(await bcrypt.hash(password, 10));
    newUser.setAdmin(UserRole.USER);
    newUser.setPathImageUser(pathImageUser);

    return this.userRepository.save(newUser);
  }

  public async createUserWithUpload(
    name: string,
    email: string,
    password: string,
    file: ImageFile,
  ): Promise<User> {
    if (await this.userRepository.findOneByEmail(email)) {
      throw new ConflictException("Email já está em uso.");
    }

    const objectStorage = this.getObjectStorage();
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser.setName(name);
    newUser.setEmail(email);
    newUser.setPassword(passwordHash);
    newUser.setAdmin(UserRole.USER);
    const storedObject = await objectStorage.upload(file, USER_IMAGE_FOLDER);

    try {
      newUser.setPathImageUser(storedObject.url);
      return await this.userRepository.save(newUser);
    } catch (error) {
      await this.removeUploadedObjectAfterFailure(storedObject.key);
      throw error;
    }
  }

  public async getUsers(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<User>> {
    const [users, total] = await this.userRepository.findPaginated(pagination);

    return createPaginatedResult(users, total, pagination);
  }

  public async getUserById(
    id: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<User> {
    assertOwnerOrAdmin(authenticatedUser, id);

    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  public async getUserWithPins(
    id: string,
    authenticatedUser: AuthenticatedUser,
    pagination: PaginationParams,
  ): Promise<{ user: User; pins: PaginatedResult<Pin> }> {
    assertOwnerOrAdmin(authenticatedUser, id);

    const user = await this.userRepository.findOne(id);
    if (!user) throw new UserNotFoundException();

    const [pins, total] = await this.userRepository.findPinsByUserIdPaginated(
      id,
      pagination,
    );

    return {
      user,
      pins: createPaginatedResult(pins, total, pagination),
    };
  }

  public async updateUser(
    id: string,
    name: string,
    email: string,
    password: string,
    pathImageUser: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<User> {
    assertOwnerOrAdmin(authenticatedUser, id);

    const user = await this.userRepository.findOne(id);
    if (!user) throw new UserNotFoundException();

    const emailOwner = await this.userRepository.findOneByEmail(email);
    if (emailOwner && emailOwner.getId() !== id) {
      throw new ConflictException("Email já está em uso.");
    }

    user.setName(name);
    user.setEmail(email);
    user.setPassword(await bcrypt.hash(password, 10));
    user.setPathImageUser(pathImageUser);

    return this.userRepository.save(user);
  }

  public async updateUserWithUpload(
    id: string,
    name: string | undefined,
    email: string | undefined,
    password: string | undefined,
    authenticatedUser: AuthenticatedUser,
    file?: ImageFile,
  ): Promise<User> {
    const user = await this.getUserForUpdate(id, email, authenticatedUser);
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    if (!file) {
      this.applyUserUpdates(user, name, email, passwordHash);
      return this.userRepository.save(user);
    }

    const objectStorage = this.getObjectStorage();
    const previousAvatarUrl = user.getPathImageUser();
    const storedObject = await objectStorage.upload(file, USER_IMAGE_FOLDER);

    try {
      this.applyUserUpdates(user, name, email, passwordHash, storedObject.url);
      const updatedUser = await this.userRepository.save(user);
      await this.removePreviousAvatarAfterSuccess(previousAvatarUrl);
      return updatedUser;
    } catch (error) {
      await this.removeUploadedObjectAfterFailure(storedObject.key);
      throw error;
    }
  }

  public async deleteUser(
    id: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    assertOwnerOrAdmin(authenticatedUser, id);

    const user = await this.userRepository.findOneWithPins(id);
    if (!user) throw new UserNotFoundException();

    const urls = new Set([
      user.getPathImageUser(),
      ...(user.pins ?? []).map((pin) => pin.getPathImage()),
    ]);
    await Promise.all(
      [...urls].map((url) => this.getObjectStorage().deleteByUrl(url)),
    );
    await this.userRepository.delete(id);
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOneByEmail(email);
    const passwordMatches = await bcrypt.compare(
      password,
      user?.getPassword() ?? DUMMY_PASSWORD_HASH,
    );

    if (!user || !passwordMatches) {
      throw new UnauthorizedException("Email ou senha incorretos.");
    }

    return jwt.sign(
      {
        userId: user.getId(),
        role: user.getAdmin(),
        readOnly: user.getEmail() === publicDemoAccount.email,
      },
      config.jwtSecret,
      { expiresIn: "1h" },
    );
  }

  private getObjectStorage(): ObjectStorage {
    if (!this.objectStorage) {
      throw new Error("O serviço de armazenamento não foi configurado.");
    }

    return this.objectStorage;
  }

  private async getUserForUpdate(
    id: string,
    email: string | undefined,
    authenticatedUser: AuthenticatedUser,
  ): Promise<User> {
    assertOwnerOrAdmin(authenticatedUser, id);

    const user = await this.userRepository.findOne(id);
    if (!user) throw new UserNotFoundException();

    if (email) {
      const emailOwner = await this.userRepository.findOneByEmail(email);
      if (emailOwner && emailOwner.getId() !== id) {
        throw new ConflictException("Email já está em uso.");
      }
    }

    return user;
  }

  private applyUserUpdates(
    user: User,
    name?: string,
    email?: string,
    passwordHash?: string,
    pathImageUser?: string,
  ): void {
    if (name) user.setName(name);
    if (email) user.setEmail(email);
    if (passwordHash) user.setPassword(passwordHash);
    if (pathImageUser) user.setPathImageUser(pathImageUser);
  }

  private async removePreviousAvatarAfterSuccess(url: string): Promise<void> {
    try {
      await this.getObjectStorage().deleteByUrl(url);
    } catch (cleanupError) {
      logger.error("Failed to remove previous user image", {
        imageUrl: url,
        errorMessage:
          cleanupError instanceof Error
            ? cleanupError.message
            : String(cleanupError),
      });
    }
  }

  private async removeUploadedObjectAfterFailure(key: string): Promise<void> {
    try {
      await this.getObjectStorage().delete(key);
    } catch (cleanupError) {
      logger.error("Failed to remove user image after database error", {
        objectKey: key,
        errorMessage:
          cleanupError instanceof Error
            ? cleanupError.message
            : String(cleanupError),
      });
    }
  }
}
