import { NextFunction, Request, Response } from "express";
import { FolderController } from "../controller/FolderController";
import { authMiddleware } from "../middlewares/authMiddleware";
import FolderRepository from "../repository/FolderRepository";
import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { FolderService } from "../service/FolderService";
import { BaseRoute } from "./BaseRoute";

export default class FolderRoute extends BaseRoute {
  private readonly folderController: FolderController;

  constructor() {
    super();
    this.folderController = new FolderController(
      new FolderService(
        new FolderRepository(),
        new UserRepository(),
        new PinRepository(),
      ),
    );
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.get(
      "/",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.getFolders(req, res, next),
    );
    this.router.post(
      "/",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.saveFolder(req, res, next),
    );
    this.router.get(
      "/mine",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.getMine(req, res, next),
    );
    this.router.post(
      "/:folderId/pins/:pinId",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.savePin(req, res, next),
    );
    this.router.delete(
      "/:folderId/pins/:pinId",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.removePin(req, res, next),
    );
    this.router.get(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.getById(req, res, next),
    );
    this.router.put(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.updateFolder(req, res, next),
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.folderController.deleteFolder(req, res, next),
    );
  }
}
