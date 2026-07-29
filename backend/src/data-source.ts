import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import Folder from "./models/Folder";
import Pin from "./models/Pin";
import { config } from "./config";
import { InitialSchema1720760000000 } from "./migration/1720760000000-InitialSchema";
import { NormalizeConstraintNames1720760000001 } from "./migration/1720760000001-NormalizeConstraintNames";
import { CascadeCategoryImages1720760000002 } from "./migration/1720760000002-CascadeCategoryImages";
import { AddImageTitle1720760000003 } from "./migration/1720760000003-AddImageTitle";
import { RenameImagesAndCategories1720760000004 } from "./migration/1720760000004-RenameImagesAndCategories";
import { AddPinLikes1720760000005 } from "./migration/1720760000005-AddPinLikes";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: config.database.url,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : undefined,
  synchronize: false,
  logging: false,
  entities: [User, Pin, Folder],
  migrations: [
    InitialSchema1720760000000,
    NormalizeConstraintNames1720760000001,
    CascadeCategoryImages1720760000002,
    AddImageTitle1720760000003,
    RenameImagesAndCategories1720760000004,
    AddPinLikes1720760000005,
  ],
  subscribers: [],
});
