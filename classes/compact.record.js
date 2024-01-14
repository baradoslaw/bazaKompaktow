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
}