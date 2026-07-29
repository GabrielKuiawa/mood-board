import NotFoundException from "../exception/NotFoundException";
import Comment from "../models/Comment";
import CommentRepository from "../repository/CommentRepository";
import PinRepository from "../repository/PinRepository";
import UserRepository from "../repository/UserRepository";
import { AuthenticatedUser } from "../types/AuthenticatedUser";
import { assertOwnerOrAdmin } from "../utils/authorization";

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly pinRepository: PinRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async getComments(pinId: string): Promise<Comment[]> {
    await this.requirePin(pinId);
    return this.commentRepository.findByPinId(pinId);
  }

  public async createComment(
    pinId: string,
    userId: string,
    content: string,
  ): Promise<Comment> {
    const [pin, user] = await Promise.all([
      this.requirePin(pinId),
      this.userRepository.findOne(userId),
    ]);
    if (!user) throw new NotFoundException("Usuário não encontrado.");

    const comment = new Comment();
    comment.setContent(content);
    comment.pin = pin;
    comment.user = user;
    const savedComment = await this.commentRepository.save(comment);
    return (await this.commentRepository.findOneWithRelations(
      savedComment.getId(),
    ))!;
  }

  public async deleteComment(
    pinId: string,
    commentId: string,
    authenticatedUser: AuthenticatedUser,
  ): Promise<void> {
    const comment = await this.requireComment(pinId, commentId);
    assertOwnerOrAdmin(authenticatedUser, comment.user.getId());
    await this.commentRepository.delete(commentId);
  }

  public async likeComment(
    pinId: string,
    commentId: string,
    userId: string,
  ): Promise<Comment> {
    const [comment, user] = await Promise.all([
      this.requireComment(pinId, commentId),
      this.userRepository.findOne(userId),
    ]);
    if (!user) throw new NotFoundException("Usuário não encontrado.");
    comment.likeBy(user);
    return this.commentRepository.save(comment);
  }

  public async unlikeComment(
    pinId: string,
    commentId: string,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.requireComment(pinId, commentId);
    comment.unlikeBy(userId);
    return this.commentRepository.save(comment);
  }

  private async requirePin(pinId: string) {
    const pin = await this.pinRepository.findOne(pinId);
    if (!pin) throw new NotFoundException("Pin não encontrado.");
    return pin;
  }

  private async requireComment(
    pinId: string,
    commentId: string,
  ): Promise<Comment> {
    const comment =
      await this.commentRepository.findOneWithRelations(commentId);
    if (!comment || comment.pin.getId() !== pinId) {
      throw new NotFoundException("Comentário não encontrado.");
    }
    return comment;
  }
}
