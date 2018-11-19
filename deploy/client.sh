#!/bin/bash

echo
CURRENT_BRANCH=`git branch | grep \* | cut -d ' ' -f2`
source deploy/setup.sh
TARGET_NAME=build
npm run build
source deploy/push_to_remote.sh
git checkout $CURRENT_BRANCH
