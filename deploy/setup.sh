#!/bin/bash   

# Load configuration
source deploy/config.sh

if [[ $(git status -s) ]]; then
  printf "Stash or commit your changes before deployment. Aborting deployment.\n"
  exit 1
fi

printf "Checking out deploy branch $DEPLOY_BRANCH for deployment\n"
git fetch
git checkout $DEPLOY_BRANCH
