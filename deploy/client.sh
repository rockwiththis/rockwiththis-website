#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh

DEST_PATH=$REMOTE_PATH/client
printf "Archiving remote $DEST_PATH\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm $REMOTE_PATH/archive/client.tar.gz; \
  cd $REMOTE_PATH \
  && tar czf client.tar.gz client \
  && mv ./client.tar.gz ./archive"
printf "Success!\n"

printf "Pushing client to remote $DEST_PATH\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm -rf $DEST_PATH"

tar czf client.tar.gz ./static ./ecosystem.client.config.js ./public ./next.config.js ./next-server.js ./src ./package.json ./pages/
# find ./ -path ./node_modules -prune -o -path ./build -prune -o -path ./.next -prune -o -path ./.git -prune -o -path ./deploy -prune -o -path ./server -prune -o -path ./scripts -prune -o -print \
  # | xargs tar czf client

scp -i $REMOTE_SSH_KEY_PATH ./client.tar.gz $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH
rm ./client.tar.gz

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  mkdir $REMOTE_PATH/client \
  && tar xzf $REMOTE_PATH/client.tar.gz -C $REMOTE_PATH/client \
  && rm $REMOTE_PATH/client.tar.gz"

printf "Success!\n"

printf "Starting client process\n"
ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cd $REMOTE_PATH/client \
  && npm install --production \
  && NODE_PATH='./src' npm run njs-build \
  && pm2 startOrRestart ecosystem.client.config.js"
printf "Success!\n"

printf "Returning to branch $CURRENT_BRANCH\n"
git checkout $CURRENT_BRANCH
