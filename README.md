# Rock With This Main Site

## Running Locally

### Database Configuration
We have not yet set up a development database, so we are querying a remote production database in both local dev and production environments.
To keep the credentials safe, save them in a file called `config/production.js` using the format of `config/production.sample.js` and run (from the repo root)
```
$ chmod 777 toolbox/setup.sh
$ toolbox/setup.sh
```
I suggest always running that file on start-up by adding the above `source toolbox/setup.sh` line to your `~/.bash_profile` file.


### Boot App
```
$ npm install
$ npm start
```

## Deploy App
```
$ pm2 deploy ecosystem.config.js production
```
