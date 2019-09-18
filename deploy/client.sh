#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh

DEST_PATH=$REMOTE_PATH/client

printf "\nArchiving remote $DEST_PATH...\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm $REMOTE_PATH/archive/client.tar.gz; \
  cd $REMOTE_PATH \
  && tar czf client.tar.gz client \
  && mv ./client.tar.gz ./archive"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm -rf $DEST_PATH"

printf "Success!\n\n"


printf "Compressing local client code...\n"

tar czf client.tar.gz ./static ./ecosystem.client.config.js ./next.config.js ./next-server.js ./src ./package.json ./pages/

printf "Success!\n\n"


printf "Uploading client to remote $DEST_PATH\n"

scp -i $REMOTE_SSH_KEY_PATH ./client.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH
rm ./client.tar.gz

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  mkdir $REMOTE_PATH/client \
  && tar xzf $REMOTE_PATH/client.tar.gz -C $REMOTE_PATH/client \
  && rm $REMOTE_PATH/client.tar.gz"

printf "Success!\n\n"


printf "Installing dependencies...\n\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/client \
  && npm install --production"

printf "\nSuccess!\n\n"


printf "Starting client process...\n\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/client \
  && NODE_PATH='./src' npm run njs-build \
  && pm2 startOrRestart ecosystem.client.config.js"

printf "\nSuccess!\n\n"

printf "\nReturning to branch $CURRENT_BRANCH\n\n"
git checkout $CURRENT_BRANCH
