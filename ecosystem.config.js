module.exports = {
  apps: [{
    name: 'rwt-homepage',
    script: 'npm',
    args: 'run start-homepage',
    env_production: {
      'NODE_ENV': 'production',
      'NODE_PATH': './src',
    }
  }, {
    name: 'rwt-api',
    script: 'npm',
    args: 'run start-api',
    env_production: {
      'NODE_ENV': 'production',
      'DB_CONFIG_FILE': '/home/ubuntu/config.js'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-208-165-207.compute-1.amazonaws.com',
      key: '~/.ssh/RWT.pem',
      ref: 'origin/master',
      repo: 'git@github.com:rockwiththis/rockwiththis-website.git',
      path: '/home/ubuntu/rockwiththis-website',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
}
