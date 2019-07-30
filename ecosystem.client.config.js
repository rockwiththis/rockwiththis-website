module.exports = {
  apps: [{
    name: 'rwt-client',
    script: 'npm',
    args: 'run njs-start',
    env: {
      'NODE_ENV': 'production',
    }
  }]
}
