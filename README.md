# Rock With This Main Site

## Running Locally

### Environment Configuration
We have not yet set up a development database, so we are querying a remote production database in both local dev and production environments.
To keep the credentials safe, save them in a file called `db/config-prod.js` using the format of `db/config-prod.sample.js`

### Boot App
```
$ npm install
$ npm start
```

## Deployment
```
$ git checkout master
$ git pull
$ pm2 deploy ecosystem.config.js production
```
