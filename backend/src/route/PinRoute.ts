import { NextFunction, Request, Response } from "express";
import { PinController } from "../controller/PinController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { parseImageUpload } from "../middlewares/imageUpload";
import FolderRepository from "../repository/FolderRepository";
import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { SpacesStorageService } from "../service/SpacesStorageService";
import { PinService } from "../service/PinService";
import { BaseRoute } from "./BaseRoute";

export default class PinRoute extends BaseRoute {
  private readonly pinController: PinController;

  constructor() {
    super();
    this.pinController = new PinController(
      new PinService(
        new PinRepository(),
        new UserRepository(),
        new FolderRepository(),
        new SpacesStorageService(),
      ),
    );
    this.initRoutes();
  }

  protected initRoutes(): void {
    this.router.get(
      "/",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.getPins(req, res, next),
    );
    this.router.post(
      "/",
      authMiddleware,
      parseImageUpload,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.savePin(req, res, next),
    );
    this.router.post(
      "/:id/likes",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.likePin(req, res, next),
    );
    this.router.delete(
      "/:id/likes",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.unlikePin(req, res, next),
    );
    this.router.get(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.getPinById(req, res, next),
    );
    this.router.put(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.updatePin(req, res, next),
    );
    this.router.delete(
      "/:id",
      authMiddleware,
      (req: Request, res: Response, next: NextFunction) =>
        this.pinController.deletePin(req, res, next),
    );
  }
}
