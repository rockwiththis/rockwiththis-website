#!/bin/bash   

# Load configuration
source deploy/config.sh

git status -s > /dev/null || echo "Stash or commit your changes before deployment" && return 1;

git fetch
git checkout $DEPLOY_BRANCH
