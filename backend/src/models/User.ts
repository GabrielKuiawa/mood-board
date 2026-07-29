import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import Folder from "./Folder";
import Comment from "./Comment";
import Pin from "./Pin";
import { UserRole } from "../enum/UserRole";
import { validateEmail, validateTextField } from "../utils/validation";
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @Column({ length: 100 })
  private name!: string;

  @Column({ length: 255 })
  private pathImageUser!: string;

  @Column({ unique: true })
  private email!: string;

  @Column()
  private password!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  private admin!: UserRole;

  @OneToMany(() => Folder, (folder) => folder.user)
  public folders!: Folder[];

  @OneToMany(() => Pin, (pin) => pin.user)
  public pins!: Pin[];

  @ManyToMany(() => Pin, (pin) => pin.likedByUsers)
  public likedPins!: Pin[];

  @OneToMany(() => Comment, (comment) => comment.user)
  public comments!: Comment[];

  @ManyToMany(() => Comment, (comment) => comment.likedByUsers)
  public likedComments!: Comment[];

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = validateTextField(name, "Nome", 100);
  }

  public getPathImageUser(): string {
    return this.pathImageUser;
  }

  public setPathImageUser(pathImageUser: string): void {
    this.pathImageUser = validateTextField(
      pathImageUser,
      "Imagem do usuário",
      255,
    );
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = validateEmail(email);
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getAdmin(): UserRole {
    return this.admin;
  }

  public setAdmin(admin: UserRole): void {
    this.admin = admin;
  }

  public addFolder(folder: Folder): void {
    if (!this.folders) {
      this.folders = [];
    }
    this.folders.push(folder);
  }

  public addPin(pin: Pin): void {
    if (!this.pins) {
      this.pins = [];
    }
    this.pins.push(pin);
  }
}
