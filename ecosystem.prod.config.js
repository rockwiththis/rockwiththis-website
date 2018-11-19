module.exports = {
  apps: [{
    name: 'rwt-api',
    script: 'npm',
    args: 'run start:api',
    env: {
      'NODE_ENV': 'production',
      'DB_CONFIG_FILE': '/home/ubuntu/config.js'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-208-165-207.compute-1.amazonaws.com',
      key: '~/.ssh/RWT.pem',
      ref: 'origin/split-processes',
      repo: 'git@github.com:rockwiththis/rockwiththis-website.git',
      path: '/home/ubuntu/rockwiththis-website',
      'post-setup': 'npm install && npm run build',
      'post-deploy': 'pm2 startOrRestart ecosystem.prod.config.js'
    }
  }
}
