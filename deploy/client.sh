#!/bin/bash

source deploy/setup.sh

export SOURCE_PATH=./build
export TARGET_NAME=client

deploy/push_to_remote.sh
