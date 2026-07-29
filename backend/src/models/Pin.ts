import {
  Column,
  Entity,
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
}
