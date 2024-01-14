import {pool} from "../utils/db";

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
    const [results] = await pool.execute("SELECT * FROM `compacts` where id = :id", {
      id,
    });

    return results.length === 0 ? null : new CompactRecord(results[0]);
  }
}