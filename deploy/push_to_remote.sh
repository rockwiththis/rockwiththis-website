#!/bin/bash

printf "Archiving remote $REMOTE_PATH/$TARGET_NAME\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  cp -r $REMOTE_PATH/$TARGET_NAME $REMOTE_PATH/archive/$TARGET_NAME"

printf "Success!\n"

printf "Pushing from ./$TARGET_NAME to remote $REMOTE_PATH/$TARGET_NAME\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  rm -rf $REMOTE_PATH/$TARGET_NAME"

find $TARGET_NAME -type f -not -path '*/node_modules*' \
  | xargs tar cf - \
  | ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
    tar xf - -C $REMOTE_PATH"

printf "Success!\n"
