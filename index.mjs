import {CompactRecord} from "./classes/compact.record.mjs";

// Dodawanie
// const cd = new CompactRecord({
//   name: 'test',
//   band: 'test',
//   year: 1234,
//   genre: 'rock',
//   price: 123.22,
// });
// (async () => {
//   await cd.insert();
// })();

// Wyszukiwanie jednego
// (async () => {
//   const cd = await CompactRecord.getOne('99949278-7690-4ab4-9003-bec1c222a1ad');
//   console.log(cd);
// })();

// Wyszukiwanie wszystkich
// (async () => {
  // const cd = await CompactRecord.findAll('');
  // console.log(cd);
// })();

// Usuwanie
// (async () => {
//   const cd = await CompactRecord.getOne('99949278-7690-4ab4-9003-bec1c222a1ad');
//   await cd.delete();
// })();

// Update
(async () => {
  const cd = await CompactRecord.getOne('7b31da88-72e1-4536-8b5c-4cfd0e118814');
  cd.genre = 'rock';
  cd.band = 'AC/DC';
  await cd.update();
})();