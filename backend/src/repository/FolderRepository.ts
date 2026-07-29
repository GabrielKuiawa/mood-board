import { In } from "typeorm";
import Folder from "../models/Folder";
import { PaginationParams } from "../types/Pagination";
import { BaseRepository } from "./BaseRepository";

export default class FolderRepository extends BaseRepository<Folder> {
  constructor() {
    super(Folder);
  }

  public async findByIds(ids: string[]): Promise<Folder[]> {
    if (ids.length === 0) return [];

    return this.repository.find({
      where: { id: In(ids) } as any,
      relations: { user: true },
    });
  }

  public async findByUserIdPaginated(
    userId: string,
    pagination: PaginationParams,
  ): Promise<[Folder[], number]> {
    return this.repository.findAndCount({
      where: { user: { id: userId } } as any,
      relations: { pins: true },
      skip: pagination.skip,
      take: pagination.limit,
      order: { name: "ASC" } as any,
    });
  }

  public async findOneWithUser(id: string): Promise<Folder | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { user: true },
    });
  }

  public async findOneWithUserAndPins(id: string): Promise<Folder | null> {
    return this.repository.findOne({
      where: { id } as any,
      relations: { user: true, pins: true },
    });
  }

  public async findSuggestions(
    queryValue: string,
    limit: number,
  ): Promise<Folder[]> {
    const query = this.repository
      .createQueryBuilder("folder")
      .orderBy("folder.name", "ASC")
      .take(limit);

    if (queryValue) {
      query.where("LOWER(folder.name) LIKE :term", {
        term: `%${queryValue.toLocaleLowerCase()}%`,
      });
    }

    return query.getMany();
  }
}
