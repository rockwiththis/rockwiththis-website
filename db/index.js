const { Pool } = require('pg');

const {
  RWT_DB_USER,
  RWT_DB_HOST,
  RWT_DB_DATABASE,
  RWT_DB_PASSWORD,
  RWT_DB_PORT
} = process.env;

if (
  !RWT_DB_USER ||
  !RWT_DB_HOST ||
  !RWT_DB_DATABASE ||
  !RWT_DB_PASSWORD ||
  !RWT_DB_PORT
) {
  throw new Error('Missing required DB env vars');
}

const database = new Pool({
  user: RWT_DB_USER,
  host: RWT_DB_HOST,
  database: RWT_DB_DATABASE,
  password: RWT_DB_PASSWORD,
  port: RWT_DB_PORT
});





module.exports = database;
