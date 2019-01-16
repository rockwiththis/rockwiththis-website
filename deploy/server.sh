#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh

printf "Archiving remote $REMOTE_PATH/server\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cp -r $REMOTE_PATH/server $REMOTE_PATH/archive/server"
printf "Success!\n"

printf "Pushing from ./server to remote $REMOTE_PATH/server\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm -rf $REMOTE_PATH/server"

find server -type f -not -path '*/node_modules*' \
  | xargs tar cf - \
  | ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
    tar xf - -C $REMOTE_PATH"

printf "Success!\n"

printf "Starting server process\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/server \
  && npm install --production \
  && pm2 startOrRestart ecosystem.config.js"
printf "Success!\n"

printf "Returning to branch $CURRENT_BRANCH\n"
git checkout $CURRENT_BRANCH
