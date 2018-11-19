#!/bin/bash

# Load configuration
source deploy/config.sh

git diff-index --quiet HEAD -- \
  || echo "Stash or commit your changes before deployment" && return 1;

git checkout $DEPLOY_BRANCH
git pull
