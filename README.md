# Rock With This Main Site

## Running Locally

### Environment Configuration
We have not yet set up a development database, so we are querying a remote production database in both local dev and production environments.
To keep the credentials safe, save them in a file called `server/db/config-prod.js` using the format of `server/db/config-prod.sample.js`

### Boot App
```
$ npm install                   # Install client packages
$ npm install --prefix server   # Install server packages
$ npm run start-all             # Boot server + client webpack server
```
You can also boot the data server and react webpack server separately from the root directory with the following commands:
```
$ npm run start         # react server
$ npm run start-server  # data server
```

## Deployment
The following scripts will pull the latest code from the branch specified in `deploy/config.sh` and deploy to the remote server configured in the same file. The client script will first create a new build of the specified branch. The server script will start or restart an active server process on the remote server.
```
$ deploy/client.sh  # build and deploy react client
$ deploy/server.sh  # deploy data server + reboot running process
```
### Notes
+ The scripts require an ssh key downloaded from from AWS existing at the path specified in `deploy/config.sh`. Contact a system admistrator for guidance on how to get this key.
+ Deployment will be blocked if you have any uncommitted changes.
+ When you first pull these files, you might have to run `chmod -R 777 deploy/` to grant yourself permission to execute the scripts
