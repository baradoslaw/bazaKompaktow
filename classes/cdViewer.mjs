import { CompactRecord } from "./compact.record.mjs";
import readline from 'readline';

const SORTING_METHOD_PARAMETERS = [1, 2, 3, 4, 5];
const SORTING_METHOD_DIRECTION = ['ASC', 'DESC'];

export class CDViewer {
  constructor() {
    this.records = [];  // Tablica przechowująca dane kompaktów CD
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.sortingMethod = {
      parameter: 'name',
      direction: 'ASC',
    }
  }

  async fetchRecords() {
    // Wyszukaj wszystkie rekordy i dodaj do tablicy
    this.records = await CompactRecord.findAll('', this.sortingMethod);
  }

  clearScreen() {
    // Czyszczenie ekranu
    console.clear();
  }

  async displayAllCDs() {
    await this.fetchRecords();
    this.clearScreen();

    // Wyświetl nagłówki tabeli
    console.log('| ID                                    | Name               | Band               | Release Year | Genre               | Price   |');
    console.log('|---------------------------------------|--------------------|--------------------|--------------|---------------------|---------|');

    // Wyświetl dane każdego rekordu w formie tabeli
    this.records.forEach(record => {
      console.log(`| ${record.id} | ${record.name.padEnd(18)} | ${record.band.padEnd(18)} | ${record.releaseYear.toString().padEnd(12)} | ${record.genre.padEnd(20)} | ${record.price.toString().padEnd(7)} |`);
    });
  }

  async displayOneCD(id) {
    const record = await CompactRecord.getOne(id);
    this.clearScreen();

    if (record) {
      // Wyświetl nagłówki tabeli
      console.log('| ID                                    | Name               | Band               | Release Year | Genre               | Price   |');
      console.log('|---------------------------------------|--------------------|--------------------|--------------|---------------------|---------|');
      // Wyświetl dane rekordu
      console.log(`| ${record.id} | ${record.name.padEnd(18)} | ${record.band.padEnd(18)} | ${record.releaseYear.toString().padEnd(12)} | ${record.genre.padEnd(20)} | ${record.price.toString().padEnd(7)} |`);
    } else {
      console.log('Nie znaleziono rekordu o podanym ID.');
    }
  }

  async deleteCD(id) {
    const record = await CompactRecord.getOne(id);
    this.clearScreen();

    if (record) {
      await record.delete();
      console.log(`Rekord o ID ${id} został usunięty.`);
    } else {
      console.log('Nie znaleziono rekordu o podanym ID.');
    }
  }

  async editCD(id) {
    const record = await CompactRecord.getOne(id);
    this.clearScreen();

    if (record) {
      console.log('\nEdycja CD:');
      console.log('Wprowadź nowe dane:');

      record.name = await this.getUserInput(`Nowa nazwa (${record.name}):`) || record.name;
      record.band = await this.getUserInput(`Nowy zespół (${record.band}):`) || record.band;
      record.releaseYear = parseInt(await this.getUserInput(`Nowy rok wydania (${record.releaseYear}):`), 10) || record.releaseYear;
      record.genre = await this.getUserInput(`Nowy gatunek (${record.genre}):`) || record.genre;
      record.price = parseFloat(await this.getUserInput(`Nowa cena (${record.price}):`)) || record.price;

      await record.update();
      console.log(`CD o ID ${id} zostało zaktualizowane.`);
    } else {
      console.log('Nie znaleziono rekordu o podanym ID.');
    }
  }

  async addCD() {
    this.clearScreen();
    console.log('\nDodawanie nowego CD:');
    console.log('Wprowadź dane:');

    const name = await this.getUserInput('Nazwa:');
    const band = await this.getUserInput('Zespół:');
    const releaseYear = parseInt(await this.getUserInput('Rok wydania:'), 10);
    const genre = await this.getUserInput('Gatunek:');
    const price = parseFloat(await this.getUserInput('Cena:'));

    const newCD = new CompactRecord({ name, band, releaseYear, genre, price });
    await newCD.insert();

    console.log('Nowe CD zostało dodane.');
  }

  checkSortingOptions(sortingMethod) {
    if (!SORTING_METHOD_PARAMETERS.includes(sortingMethod.parameter) || (!SORTING_METHOD_DIRECTION.includes(sortingMethod.direction))) {
      this.clearScreen();
      console.log('Wprowadzono niepoprawne dane! Proszę spróbować ponownie.');
      return false;
    } else {
      return true;
    }
  }

  async displayMenu() {
    console.log('\nMenu:');
    console.log('1. Dodaj nowe CD');
    console.log('2. Wyświetl wszystkie CD');
    console.log('3. Wyświetl jedno CD');
    console.log('4. Edytuj CD');
    console.log('5. Usuń CD');
    console.log('6. Wybierz sposób sortowania')
    console.log('7. Wyjście');

    const choice = await this.getUserChoice();

    switch (choice) {
      case '1':
        await this.addCD();
        break;
      case '2':
        await this.displayAllCDs();
        break;
      case '3':
        console.log('\nWprowadź ID CD:');
        const cdId = await this.getUserInput();
        await this.displayOneCD(cdId);
        break;
      case '4':
        console.log('\nWprowadź ID CD do edycji:');
        const cdIdToEdit = await this.getUserInput();
        await this.editCD(cdIdToEdit);
        break;
      case '5':
        console.log('\nWprowadź ID CD do usunięcia:');
        const cdIdToDelete = await this.getUserInput();
        await this.deleteCD(cdIdToDelete);
        break;
      case '6':
        const sortingMethod = {
          parameter: 'name',
          direction: 'ASC',
        };

        do {
          console.log('\nWybierz, według którego parametru ma się odbywać sortowanie:');
          console.log('1. Nazwa');
          console.log('2. Zespół');
          console.log('3. Rok wydania');
          console.log('4. Gatunek');
          console.log('5. Cena');
          console.log('Następnie wpisz kierunek czy dane mają być sortowane rosnąco (ASC) czy malejąco (DESC)');

          sortingMethod.parameter = Number(await this.getUserInput());
          sortingMethod.direction = await this.getUserInput();
        } while (!this.checkSortingOptions(sortingMethod))

        switch (sortingMethod.parameter) {
          case 1:
            sortingMethod.parameter = 'name';
            break;
          case 2:
            sortingMethod.parameter = 'band';
            break;
          case 3:
            sortingMethod.parameter = 'release_year';
            break;
          case 4:
            sortingMethod.parameter = 'genre';
            break;
          case 5:
            sortingMethod.parameter = 'price';
            break;
        }
        this.sortingMethod = sortingMethod;
        console.log(this.sortingMethod);
        break;
      case '7':
        console.log('Do widzenia!');
        process.exit();
        break;
      default:
        console.log('Nieprawidłowy wybór.');
        break;
    }

    // Rekurencyjne wywołanie menu po zakończeniu wybranej operacji
    await this.displayMenu();
  }

  async getUserChoice() {
    console.log('\nWybierz opcję (wprowadź numer):');
    return await this.getUserInput();
  }

  async getUserInput(prompt) {
    console.log(prompt);
    return new Promise(resolve => {
      this.rl.question('', data => {
        resolve(data.trim());
      });
    });
  }
}