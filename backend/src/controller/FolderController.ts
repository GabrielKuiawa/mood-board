import { NextFunction, Request, Response } from "express";
import Folder from "../models/Folder";
import { FolderService } from "../service/FolderService";
import {
  getAuthenticatedUser,
  getAuthenticatedUserId,
} from "../utils/authorization";
import { serializePaginationMeta } from "../utils/pagination";
import {
  validateId,
  validatePagination,
  validateTextField,
} from "../utils/validation";

export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  public async saveFolder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const folder = await this.folderService.saveFolder(
        validateTextField(req.body.name, "Nome", 100),
        getAuthenticatedUserId(req),
      );
      res.status(201).json({
        message: "Pasta criada",
        data: this.serializeFolder(folder),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getFolders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.folderService.getFoldersByUserId(
        getAuthenticatedUserId(req),
        validatePagination(req.query.page, req.query.limit),
      );
      res.json({
        data: result.data.map((folder) => this.serializeFolder(folder)),
        meta: serializePaginationMeta(req, result.meta),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getMine(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.folderService.getFoldersByUserId(
        getAuthenticatedUserId(req),
        validatePagination(req.query.page, req.query.limit),
      );
      res.json({
        data: result.data.map((folder) => this.serializeFolder(folder)),
        meta: serializePaginationMeta(req, result.meta),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const folder = await this.folderService.getFolderById(
        validateId(req.params.id),
        getAuthenticatedUserId(req),
      );
      res.json(this.serializeFolder(folder));
    } catch (error) {
      next(error);
    }
  }

  public async updateFolder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const folder = await this.folderService.updateFolder(
        validateId(req.params.id),
        validateTextField(req.body.name, "Nome", 100),
        getAuthenticatedUser(req),
      );
      res.json({
        message: "Pasta atualizada",
        data: this.serializeFolder(folder),
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteFolder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.folderService.deleteFolder(
        validateId(req.params.id),
        getAuthenticatedUser(req),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async savePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const folder = await this.folderService.savePin(
        validateId(req.params.folderId),
        validateId(req.params.pinId),
        getAuthenticatedUser(req),
      );
      res.json({
        message: "Pin salvo na pasta",
        data: this.serializeFolder(folder),
      });
    } catch (error) {
      next(error);
    }
  }

  public async removePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.folderService.removePin(
        validateId(req.params.folderId),
        validateId(req.params.pinId),
        getAuthenticatedUser(req),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  private serializeFolder(folder: Folder) {
    return {
      id: folder.getId(),
      name: folder.getName(),
      pinCount: folder.getPins().length,
    };
  }
}
