import {pool} from "../utils/db.mjs";
import {v4 as uuid} from "uuid";

export class CompactRecord {
  id;
  name;
  band;
  release_year;
  genre;
  price;

  constructor (obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.band = obj.band;
    this.release_year = obj.release_year;
    this.genre = obj.genre;
    this.price = obj.price;
  }

  static async getOne(id) {
    const [results] = await pool.execute("SELECT * FROM `cds` WHERE id = :id", {
      id,
    });

    return results.length === 0 ? null : new CompactRecord(results[0]);
  }

  static async findAll(name) {
    const [results] = await pool.execute("SELECT * FROM `cds` WHERE `name` LIKE :search", {
      search: `%${name}%`,
    });

    return results.map(obj => {
      return new CompactRecord(obj);
    });
  }

  async insert() {
    this.id = uuid();
    const [added] = await pool.execute("INSERT INTO `cds` (`id`, `name`, `band`, `release_year`, `genre`, `price`) VALUES (:id, :name, :band, :release_year, :genre, :price)", this);
  }

  async delete() {
    await pool.execute("DELETE FROM `cds` WHERE `id` = :id", {
      id: this.id,
    });
  }

  async update() {
    const [result] = await pool.execute("UPDATE `cds` SET `name` = :name, `band` = :band, `release_year` = :release_year, `genre` = :genre, `price` = :price WHERE `id` = :id", this);
    return result;
  }
}