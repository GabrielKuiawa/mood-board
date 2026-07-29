import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { validateTextField } from "../utils/validation";
import Pin from "./Pin";
import { User } from "./User";

@Entity()
@Unique(["name", "user"])
export default class Folder {
  @PrimaryGeneratedColumn("uuid")
  private id!: string;

  @Column({ nullable: false, length: 100 })
  private name!: string;

  @ManyToMany(() => Pin, (pin) => pin.folders, { onDelete: "CASCADE" })
  @JoinTable({
    name: "folder_pins_pin",
    joinColumn: { name: "folderId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "pinId", referencedColumnName: "id" },
  })
  public pins!: Pin[];

  @ManyToOne(() => User, (user) => user.folders, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  public user!: User;

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = validateTextField(name, "Nome", 100);
  }

  public setUser(user: User): void {
    if (!user) {
      throw new Error("User cannot be null.");
    }
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }

  public getPins(): Pin[] {
    return this.pins ?? [];
  }

  public addPin(pin: Pin): void {
    if (!this.pins) this.pins = [];
    if (!this.pins.some((savedPin) => savedPin.getId() === pin.getId())) {
      this.pins.push(pin);
    }
  }

  public removePin(pinId: string): void {
    this.pins = this.getPins().filter((pin) => pin.getId() !== pinId);
  }

  public hasPin(pinId: string): boolean {
    return this.getPins().some((pin) => pin.getId() === pinId);
  }
}
