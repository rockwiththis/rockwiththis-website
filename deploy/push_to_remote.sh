#!/bin/bash

DEST_PATH=$REMOTE_PATH/$TARGET_NAME/$(date +%Y%m%d%H%M%S)
printf "Pushing from ./$TARGET_NAME to remote $DEST_PATH\n"

find $TARGET_NAME -type f -not -path '*/node_modules*' \
  | xargs tar cf - \
  | ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
    mkdir $DEST_PATH && tar xf - -C $DEST_PATH"

printf "Success!\n"

printf "Updating current link\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  ln -sfn $DEST_PATH current"

printf "Success!\n"

printf "Removing oldest $TARGET_NAME from $REMOTE_PATH/$TARGET_NAME\n"

ssh -i $REMOTE_SSH_KEY_PATH $REMOTE_USER@$REMOTE_HOST "\
  ls $REMOVE_PATH/$TARGET_NAME/$TARGET_NAME* \
  | head -n1 \
  | xargs rm -rf"

printf "Success!\n"
