#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh

npm run build

DEST_PATH=$REMOTE_PATH/build
DEST_NAME=build-$(date +%Y%m%d%H%M%S)
printf "Pushing from ./build to remote $DEST_PATH/$DEST_NAME\n"

find build -type f -not -path '*/node_modules*' \
  | xargs tar cf - \
  | ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
    tar xf - -C $DEST_PATH && mv $DEST_PATH/build $DEST_PATH/$DEST_NAME"

printf "Success!\n"

printf "Updating current link\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  ln -sfn $DEST_PATH/$DEST_NAME $DEST_PATH/current"

printf "Success!\n"

printf "Removing oldest build from $REMOTE_PATH/build\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  ls -d $REMOTE_PATH/build/build* \
  | head -n1 \
  | xargs rm -rf"

printf "Success!\n"

git checkout $CURRENT_BRANCH
