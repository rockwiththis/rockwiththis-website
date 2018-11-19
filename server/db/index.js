const { Pool } = require('pg');

const { DB_CONFIG_FILE } = process.env;
const {
  db: { user, host, name, password, port }
} = require(DB_CONFIG_FILE);

if (
  !user ||
  !host ||
  !name ||
  !password ||
  !port
) {
  throw new Error('Missing required DB env vars');
}

const database = new Pool({
  user: user,
  host: host,
  database: name,
  password: password,
  port: port
});

module.exports = database;