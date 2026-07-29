import { User } from "../models/User";
import { BaseRepository } from "./BaseRepository";
import Pin from "../models/Pin";
import { PaginationParams } from "../types/Pagination";

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email } as any);
  }

  public async findOneWithPins(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { pins: true },
    });
  }

  public async findPinsByUserIdPaginated(
    id: string,
    pagination: PaginationParams,
  ): Promise<[Pin[], number]> {
    return this.repository.manager.getRepository(Pin).findAndCount({
      where: { user: { id } } as any,
      skip: pagination.skip,
      take: pagination.limit,
      order: { id: "ASC" } as any,
    });
  }

  public async findSuggestions(
    queryValue: string,
    limit: number,
  ): Promise<User[]> {
    const query = this.repository
      .createQueryBuilder("user")
      .orderBy("user.name", "ASC")
      .take(limit);

    if (queryValue) {
      query.where("LOWER(user.name) LIKE :term", {
        term: `%${queryValue.toLocaleLowerCase()}%`,
      });
    }

    return query.getMany();
  }
}
