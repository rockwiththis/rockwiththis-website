module.exports = {
  apps: [{
    name: 'rwt-homepage',
    script: 'npm',
    args: 'run start:homepage',
    env: {
      NODE_ENV: 'development',
      NODE_PATH: './src'
    }
  }, {
    name: 'rwt-api',
    script: 'npm',
    args: 'run start:api',
    env: {
      'NODE_ENV': 'development',
      'DB_CONFIG_FILE': './config-prod.js'
    }
  }]
}
