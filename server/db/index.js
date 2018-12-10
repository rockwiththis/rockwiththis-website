const { Pool } = require('pg');

const dbConfigFilepath = process.env.DB_CONFIG_FILE ?
  process.env.DB_CONFIG_FILE : './config-prod.js';

const {
  db: { user, host, name, password, port }
} = require(dbConfigFilepath);

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
