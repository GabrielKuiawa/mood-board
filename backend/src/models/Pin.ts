import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { validateTextField } from "../utils/validation";
import Folder from "./Folder";
import { User } from "./User";

@Entity()
export default class Pin {
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @Column({ length: 255 })
  private pathImage!: string;

  @Column({ length: 150 })
  private title!: string;

  @Column({ length: 500 })
  private description!: string;

  @ManyToMany(() => Folder, (folder) => folder.pins)
  public folders!: Folder[];

  @ManyToMany(() => User, (user) => user.likedPins)
  @JoinTable({
    name: "user_liked_pins_pin",
    joinColumn: { name: "pinId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  public likedByUsers!: User[];

  @ManyToOne(() => User, (user) => user.pins, {
    nullable: false,
    onDelete: "CASCADE",
  })
  public user!: User;

  public getId(): string {
    return this.id;
  }

  public setPathImage(pathImage: string): void {
    this.pathImage = validateTextField(pathImage, "Caminho da imagem", 255);
  }

  public getPathImage(): string {
    return this.pathImage;
  }

  public setTitle(title: string): void {
    this.title = validateTextField(title, "Título", 150);
  }

  public getTitle(): string {
    return this.title;
  }

  public setDescription(description: string): void {
    this.description = validateTextField(description, "Descrição", 500);
  }

  public getDescription(): string {
    return this.description;
  }

  public addFolder(folder: Folder): void {
    if (!this.folders) this.folders = [];
    if (
      !this.folders.some(
        (savedFolder) => savedFolder.getId() === folder.getId(),
      )
    ) {
      this.folders.push(folder);
    }
  }

  public getFolders(): Folder[] {
    return this.folders ?? [];
  }

  public setFolders(folders: Folder[]): void {
    this.folders = folders;
  }

  public getUser(): User {
    return this.user;
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
