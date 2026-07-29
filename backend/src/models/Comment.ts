import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { validateTextField } from "../utils/validation";
import Pin from "./Pin";
import { User } from "./User";

@Entity()
export default class Comment {
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @Column({ length: 500 })
  private content!: string;

  @CreateDateColumn({ type: "datetime", precision: 6 })
  private createdAt!: Date;

  @ManyToOne(() => User, (user) => user.comments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  public user!: User;

  @ManyToOne(() => Pin, (pin) => pin.comments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  public pin!: Pin;

  @ManyToMany(() => User, (user) => user.likedComments)
  @JoinTable({
    name: "user_liked_comments_comment",
    joinColumn: { name: "commentId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  public likedByUsers!: User[];

  public getId(): string {
    return this.id;
  }

  public setContent(content: string): void {
    this.content = validateTextField(content, "Comentário", 500);
  }

  public getContent(): string {
    return this.content;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getLikedByUsers(): User[] {
    return this.likedByUsers ?? [];
  }

  public likeBy(user: User): void {
    if (!this.likedByUsers) this.likedByUsers = [];
    if (!this.isLikedBy(user.getId())) this.likedByUsers.push(user);
  }

  public unlikeBy(userId: string): void {
    this.likedByUsers = this.getLikedByUsers().filter(
      (user) => user.getId() !== userId,
    );
  }

  public isLikedBy(userId: string): boolean {
    return this.getLikedByUsers().some((user) => user.getId() === userId);
  }
}
