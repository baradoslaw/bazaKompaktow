import {pool} from "../utils/db";
import uuid from "uuid";

export class CompactRecord {
  id;
  name;
  band;
  year;
  genre;
  price;

  constructor (obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.band = obj.band;
    this.year = obj.year;
    this.genre = obj.genre;
    this.price = obj.price;
  }

  static async getOne(id) {
    const [results] = await pool.execute("SELECT * FROM `compacts` WHERE id = :id", {
      id,
    });

    return results.length === 0 ? null : new CompactRecord(results[0]);
  }

  static async findAll(name) {
    const [results] = await pool.execute("SELECT * FROM `compacts` WHERE `name` LIKE :search", {
      search: `%${name}%`,
    });

    return results.map(obj => {
      return new CompactRecord(obj);
    });
  }

  async insert() {
    this.id = uuid();
    const [added] = await pool.execute("INSERT INTO `compacts`(`id`, `name`, `band`, `year`, `genre`, `price`) VALUES (:id, :name, :band, :year, :genre, :price)", this);

    console.log(added);
  }
}