import { Express } from "express";
import express = require("express");
import request = require("supertest");
import {
  globalErrorHandler,
  notFoundHandler,
} from "../../../src/middlewares/errorHandler";
import { requestContext } from "../../../src/middlewares/requestContext";
import Route from "../../../src/route/Route";

function createApp(): Express {
  const app = express();
  app.use(requestContext);
  app.use(new Route().getRouter());
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
  return app;
}

describe("root route", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("presents the API and its main endpoints", async () => {
    const response = await request(createApp()).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
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

  it("keeps returning 404 for unknown routes", async () => {
    jest.spyOn(process.stderr, "write").mockImplementation(() => true);

    const response = await request(createApp()).get("/missing-route");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      message: "Página não encontrada",
      status: 404,
    });
  });
});
