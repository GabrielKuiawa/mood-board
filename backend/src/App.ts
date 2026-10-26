import { Application } from "express";
import express = require("express");
import cors = require("cors");
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler";
import { requestContext } from "./middlewares/requestContext";
import Route from "./route/Route";
import { AppDataSource } from "./data-source";
import { config } from "./config";
import path from "node:path";

export default class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.app.set("trust proxy", 1);
    this.initMiddlewares();
  }

  public async initialize(): Promise<void> {
    await this.initDatabase();
    this.initRoutes();
  }

  private async initDatabase(): Promise<void> {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
  }

  private initMiddlewares(): void {
    this.app.use(requestContext);
    this.app.use(
      cors({
        origin: config.corsOrigins,
        exposedHeaders: ["X-Request-Id"],
      }),
    );
    this.app.use(express.json({ limit: "100kb" }));
  }

  private initRoutes(): void {
    this.app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
    const route = new Route();
    this.app.use("/", route.getRouter());
    this.initErrorHandling();
  }

  private initErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(globalErrorHandler);
  }

  public getApp(): Application {
    return this.app;
  }
}
