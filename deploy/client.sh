#!/bin/bash

echo
source deploy/setup.sh
TARGET_NAME=build
npm run build
source deploy/push_to_remote.sh
