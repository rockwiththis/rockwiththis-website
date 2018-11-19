#!/bin/bash

source deploy/setup.sh

export SOURCE_PATH=./server
export TARGET_NAME=server

deploy/push_to_remote.sh

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_HOST "\
  cd $REMOTE_PATH/server \
  && npm install
  && pm2 startOrRestart ecosystem.config.js"
