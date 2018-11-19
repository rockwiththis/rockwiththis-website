# Rock With This Main Site

## Running Locally

### Environment Configuration
We have not yet set up a development database, so we are querying a remote production database in both local dev and production environments.
To keep the credentials safe, save them in a file called `server/db/config-prod.js` using the format of `server/db/config-prod.sample.js`

### Boot App
```
$ npm install
$ npm start-all
```
You can also boot the data server and react webpack server separately with the following commands:
```
$ npm start         # react server
$ npm start-server  # data server
```

## Deployment
```
$ deploy/client.sh  # build and deploy react client
$ deploy/server.sh  # deploy data server + reboot running process
```
