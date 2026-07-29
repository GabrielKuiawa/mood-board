import { Router, Request, Response } from "express";
import FolderRoute from "./FolderRoute";
import PinRoute from "./PinRoute";
import UserRoute from "./UserRoute";
import SearchRoute from "./SearchRoute";

export default class Route {
  private router: Router = Router();

  constructor() {
    this.initRoute();
  }

  private initRoute(): void {
    this.router.get("/", (_req: Request, res: Response) => {
      res.json({
        name: "Mood Board API",
        description: "API REST da plataforma de inspiração visual Mood Board.",
        repository: "https://github.com/GabrielKuiawa/mood-board",
        endpoints: {
          pins: "/api/pin",
          folders: "/api/folder",
          users: "/api/user",
          login: "/api/user/login",
          search: "/api/search/suggestions",
        },
      });
    });

    const folderRoute = new FolderRoute();
    const pinRoute = new PinRoute();
    const userRoute = new UserRoute();
    const searchRoute = new SearchRoute();
    this.router.use("/api/folder", folderRoute.getRouter());
    this.router.use("/api/pin", pinRoute.getRouter());
    this.router.use("/api/user", userRoute.getRouter());
    this.router.use("/api/search", searchRoute.getRouter());
  }

  public getRouter(): Router {
    return this.router;
  }
}
