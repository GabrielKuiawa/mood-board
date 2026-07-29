import { Express } from "express";
import express = require("express");
import request = require("supertest");
import {
  MAX_IMAGE_SIZE_BYTES,
  parseImageUpload,
} from "../../../src/middlewares/imageUpload";
import { globalErrorHandler } from "../../../src/middlewares/errorHandler";
import { requestContext } from "../../../src/middlewares/requestContext";

function createApp(): Express {
  const app = express();
  app.use(requestContext);
  app.post("/upload", parseImageUpload, (req, res) => {
    res.json({
      body: req.body,
      mimetype: req.file?.mimetype,
    });
  });
  app.use(globalErrorHandler);
  return app;
}

describe("parseImageUpload", () => {
  it("parses the image and repeated FormData fields", async () => {
    const response = await request(createApp())
      .post("/upload")
      .field("title", "Architecture")
      .field("folderIds", "folder-1")
      .field("folderIds", "folder-2")
      .attach("image", Buffer.from("image"), {
        filename: "image.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      body: {
        title: "Architecture",
        folderIds: ["folder-1", "folder-2"],
      },
      mimetype: "image/png",
    });
  });

  it("rejects unsupported file types", async () => {
    const response = await request(createApp())
      .post("/upload")
      .attach("image", Buffer.from("text"), {
        filename: "notes.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "O arquivo precisa ser uma imagem JPEG, PNG ou WebP.",
    );
  });

  it("rejects images larger than 10 MB", async () => {
    const response = await request(createApp())
      .post("/upload")
      .attach("image", Buffer.alloc(MAX_IMAGE_SIZE_BYTES + 1), {
        filename: "large.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(413);
    expect(response.body.message).toBe("A imagem não pode exceder 10 MB.");
  });
});
