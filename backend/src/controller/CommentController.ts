import { NextFunction, Request, Response } from "express";
import Comment from "../models/Comment";
import { CommentService } from "../service/CommentService";
import {
  getAuthenticatedUser,
  getAuthenticatedUserId,
} from "../utils/authorization";
import { validateId, validateTextField } from "../utils/validation";

export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  public async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const comments = await this.commentService.getComments(
        validateId(req.params.id),
      );
      res.json({
        data: comments.map((comment) => this.serialize(comment, userId)),
      });
    } catch (error) {
      next(error);
    }
  }

  public async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const comment = await this.commentService.createComment(
        validateId(req.params.id),
        userId,
        validateTextField(req.body.content, "Comentário", 500),
      );
      res.status(201).json({
        message: "Comentário criado",
        data: this.serialize(comment, userId),
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      await this.commentService.deleteComment(
        validateId(req.params.id),
        validateId(req.params.commentId),
        getAuthenticatedUser(req),
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async likeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const comment = await this.commentService.likeComment(
        validateId(req.params.id),
        validateId(req.params.commentId),
        userId,
      );
      res.json({
        message: "Comentário curtido",
        data: this.serialize(comment, userId),
      });
    } catch (error) {
      next(error);
    }
  }

  public async unlikeComment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = getAuthenticatedUserId(req);
      const comment = await this.commentService.unlikeComment(
        validateId(req.params.id),
        validateId(req.params.commentId),
        userId,
      );
      res.json({
        message: "Curtida removida",
        data: this.serialize(comment, userId),
      });
    } catch (error) {
      next(error);
    }
  }

  private serialize(comment: Comment, authenticatedUserId: string) {
    return {
      id: comment.getId(),
      content: comment.getContent(),
      createdAt: comment.getCreatedAt(),
      author: {
        id: comment.user.getId(),
        name: comment.user.getName(),
        pathImageUser: comment.user.getPathImageUser(),
      },
      likeCount: comment.getLikedByUsers().length,
      likedByCurrentUser: comment.isLikedBy(authenticatedUserId),
      canDelete: comment.user.getId() === authenticatedUserId,
    };
  }
}
