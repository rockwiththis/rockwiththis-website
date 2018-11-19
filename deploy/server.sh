#!/bin/bash

echo
source deploy/setup.sh
TARGET_NAME=server
source deploy/push_to_remote.sh

printf "Starting server process\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/server \
  && npm install \
  && pm2 startOrRestart ecosystem.config.js"
printf "Success!\n"
