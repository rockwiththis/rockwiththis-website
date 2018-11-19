module.exports = {
  apps: [{
    name: 'rwt-api',
    script: 'npm',
    args: 'start',
    env: {
      'NODE_ENV': 'production',
      'DB_CONFIG_FILE': '/home/ubuntu/config.js'
    }
  }]
}
