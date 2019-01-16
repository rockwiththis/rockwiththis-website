#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh
TARGET_NAME=server
source deploy/push_to_remote.sh

printf "Starting server process\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/server/current \
  && npm install --production \
  && pm2 start ecosystem.config.js"
printf "Success!\n"

printf "Returning to branch $CURRENT_BRANCH\n"
git checkout $CURRENT_BRANCH
