import {createPool} from "mysql2/promise";

export const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cd',
  port: 3306,
  namedPlaceholders: true,
  decimalNumbers: true,
});