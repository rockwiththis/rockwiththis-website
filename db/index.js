const { Pool } = require('pg');

const { GITHUB_ROOT, ENV_CONFIG_FILE } = process.env;
const configFile = ENV_CONFIG_FILE ? ENV_CONFIG_FILE : `${GITHUB_ROOT}/config/config-dev.json`

const { db: { user, host, name, password, port } } = require(configFile);

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
