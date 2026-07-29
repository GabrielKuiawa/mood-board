import Pin from "../models/Pin";
import { PaginationParams } from "../types/Pagination";
import { PinSearchFilters } from "../types/Search";
import { BaseRepository } from "./BaseRepository";

export default class PinRepository extends BaseRepository<Pin> {
  constructor() {
    super(Pin);
  }

  public async findAllWithRelationsPaginated(
    pagination: PaginationParams,
  ): Promise<[Pin[], number]> {
    return this.repository.findAndCount({
      relations: {
        folders: { user: true },
        user: true,
        likedByUsers: true,
      },
      skip: pagination.skip,
      take: pagination.limit,
      order: { id: "ASC" } as any,
    });
  }

  public async searchWithRelationsPaginated(
    pagination: PaginationParams,
    filters: PinSearchFilters,
  ): Promise<[Pin[], number]> {
    const query = this.repository
      .createQueryBuilder("pin")
      .leftJoinAndSelect("pin.user", "user")
      .leftJoinAndSelect("pin.folders", "folder")
      .leftJoinAndSelect("folder.user", "folderUser")
      .leftJoinAndSelect("pin.likedByUsers", "likedByUser")
      .distinct(true)
      .orderBy("pin.id", "ASC")
      .skip(pagination.skip)
      .take(pagination.limit);

    if (filters.target) {
      const { id, type } = filters.target;

      if (type === "pin") query.where("pin.id = :id", { id });
      if (type === "user") query.where("user.id = :id", { id });
    } else if (filters.query) {
      const term = `%${filters.query.toLocaleLowerCase()}%`;
      query.where(
        "(LOWER(pin.title) LIKE :term OR LOWER(user.name) LIKE :term)",
        { term },
      );
    }

    return query.getManyAndCount();
  }

  public async findSuggestions(
    queryValue: string,
    limit: number,
  ): Promise<Pin[]> {
    const query = this.repository
      .createQueryBuilder("pin")
      .leftJoinAndSelect("pin.user", "user")
      .orderBy("pin.title", "ASC")
      .take(limit);

    if (queryValue) {
      query.where("LOWER(pin.title) LIKE :term", {
        term: `%${queryValue.toLocaleLowerCase()}%`,
      });
    }

    return query.getMany();
  }

  public async findOneWithRelations(id: string): Promise<Pin | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: {
        folders: { user: true },
        user: true,
        likedByUsers: true,
      },
    });
  }
}
