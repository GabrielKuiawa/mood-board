import { NextFunction, Request, Response } from "express";
import Pin from "../models/Pin";
import { PinService } from "../service/PinService";
import {
  getAuthenticatedUser,
  getAuthenticatedUserId,
} from "../utils/authorization";
import { validateUploadedImage } from "../utils/imageUpload";
import { serializePaginationMeta } from "../utils/pagination";
import { validatePinSearchFilters } from "../utils/search";
import {
  validateId,
  validateIdArray,
  validatePagination,
  validateTextField,
} from "../utils/validation";

export class PinController {
  constructor(private readonly pinService: PinService) {}

  public async savePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawFolderIds = req.body.folderIds;
      const folderIdsValue =
        rawFolderIds === undefined
          ? []
          : Array.isArray(rawFolderIds)
            ? rawFolderIds
            : [rawFolderIds];
      const pin = await this.pinService.createPinWithUpload(
        validateTextField(req.body.title, "Título", 150),
        validateTextField(req.body.description, "Descrição", 500),
        getAuthenticatedUserId(req),
        validateIdArray(folderIdsValue, "folderIds"),
        validateUploadedImage(req.file),
      );

      res.status(201).json({
        message: "Pin criado com sucesso",
        data: this.serializePin(pin, getAuthenticatedUserId(req)),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPins(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await this.pinService.getPins(
        validatePagination(req.query.page, req.query.limit),
        validatePinSearchFilters(req.query.q, req.query.type, req.query.id),
      );
      const userId = getAuthenticatedUserId(req);
      res.json({
        data: result.data.map((pin) => this.serializePin(pin, userId)),
        meta: serializePaginationMeta(req, result.meta),
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPinById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const pin = await this.pinService.getPinById(validateId(req.params.id));
      res.json(this.serializePin(pin, getAuthenticatedUserId(req)));
    } catch (error) {
      next(error);
    }
  }

  public async updatePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawFolderIds = req.body.folderIds ?? [];
      const pin = await this.pinService.updatePin(
        validateId(req.params.id),
        validateTextField(req.body.title, "Título", 150),
        validateTextField(req.body.pathImage, "Caminho da imagem", 255),
        validateTextField(req.body.description, "Descrição", 500),
        validateIdArray(rawFolderIds, "folderIds"),
        getAuthenticatedUser(req),
      );

      res.json({
        message: "Pin atualizado",
        data: this.serializePin(pin, getAuthenticatedUserId(req)),
      });
    } catch (error) {
      next(error);
    }
  }

  public async likePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = getAuthenticatedUserId(req);
      const pin = await this.pinService.likePin(
        validateId(req.params.id),
        userId,
      );
      res.json({
        message: "Pin curtido",
        data: this.serializePin(pin, userId),
      });
    } catch (error) {
      next(error);
    }
  }

  public async unlikePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = getAuthenticatedUserId(req);
      const pin = await this.pinService.unlikePin(
        validateId(req.params.id),
        userId,
      );
      res.json({
        message: "Curtida removida",
        data: this.serializePin(pin, userId),
      });
    } catch (error) {
      next(error);
    }
  }

  public async deletePin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.pinService.deletePin(
        validateId(req.params.id),
        getAuthenticatedUser(req),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  private serializePin(pin: Pin, authenticatedUserId: string) {
    const ownerId = pin.getUser().getId();
    const userFolders = pin
      .getFolders()
      .filter((folder) => folder.getUser().getId() === authenticatedUserId);

    return {
      id: pin.getId(),
      title: pin.getTitle(),
      pathImage: pin.getPathImage(),
      description: pin.getDescription(),
      author: {
        id: ownerId,
        name: pin.getUser().getName(),
        pathImageUser: pin.getUser().getPathImageUser(),
      },
      folders: userFolders.map((folder) => ({
        id: folder.getId(),
        name: folder.getName(),
      })),
      savedFolderIds: userFolders.map((folder) => folder.getId()),
      likeCount: pin.getLikedByUsers().length,
      likedByCurrentUser: pin.isLikedBy(authenticatedUserId),
      commentCount: pin.getComments().length,
    };
  }
}
