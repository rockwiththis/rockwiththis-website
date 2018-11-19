#!/bin/bash   

# Load configuration
source deploy/config.sh

if [[ $(git status -s) ]]; then
  echo "Stash or commit your changes before deployment. Aborting deployment."
  exit 1
fi

git fetch
git checkout $DEPLOY_BRANCH
