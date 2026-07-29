import Comment from "../models/Comment";
import { BaseRepository } from "./BaseRepository";

export default class CommentRepository extends BaseRepository<Comment> {
  constructor() {
    super(Comment);
  }

  public async findByPinId(pinId: string): Promise<Comment[]> {
    return this.repository.find({
      where: { pin: { id: pinId } } as any,
      relations: { user: true, pin: true, likedByUsers: true },
      order: { createdAt: "ASC" } as any,
    });
  }

  public async findOneWithRelations(id: string): Promise<Comment | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { user: true, pin: true, likedByUsers: true },
    });
  }
}
