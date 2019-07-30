#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh

DEST_PATH=$REMOTE_PATH/client
printf "Archiving remote $DEST_PATH\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cp -r $REMOTE_PATH/client $REMOTE_PATH/archive/client"
printf "Success!\n"

printf "Pushing client to remote $DEST_PATH\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm -rf $DEST_PATH"

find ./ -path ./node_modules -prune -o -path ./build -prune -o -path ./.next -prune -o -path ./.git -prune -o -path ./deploy -prune -o -path ./server -prune -o -path ./scripts -prune -o -print \
  | xargs tar cf - \
  | ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
    tar xf - -C $DEST_PATH"

printf "Success!\n"

printf "Starting client process\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  npm install --production \
  && pm2 startOrRestart ecosystem.config.js"
printf "Success!\n"

printf "Returning to branch $CURRENT_BRANCH\n"
git checkout $CURRENT_BRANCH
