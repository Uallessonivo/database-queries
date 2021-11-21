import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("title like :partial_title", { partial_title: `%${param}%` })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(*) FROM GAMES");
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const gamesByUser = await this.repository
      .createQueryBuilder("games")
      .whereInIds(id)
      .leftJoinAndSelect("games.users", "user")
      .getOne();

    return gamesByUser.users;
  }
}
