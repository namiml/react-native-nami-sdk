#!/bin/bash

function android_pull() {
    cd android && rm -rf .gradle && rm -rf .idea && rm -rf android.iml && rm -rf local.properties
    cd ..
}

function ios_pull() {
    cd ios && rm -rf Pods && rm -rf build  && pod update && pod install
    cd ..
}

function osTv_pull() {
  cd ios && rm -rf Pods Podfile.lock && RCT_NEW_ARCH_ENABLED=0 SWIFT_VERSION=5 pod install
  cd ..
}

function default_cmds() {
    rm -rf node_modules && yarn install
}

if [ "$1" == "android" ]; then
    echo "Running android install"
    default_cmds
    android_pull
elif [ "$1" == "ios" ]; then
    echo "Running ios install"
    default_cmds
    ios_pull
elif [ "$1" == "tvOS" ]; then
    echo "Running tvOs install"
    default_cmds
    osTv_pull
elif [ "$1" == "both" ]; then
    echo "Running both installations"
    default_cmds
    android_pull
    ios_pull
else
    echo "Unknown command: $1"
    echo "Usage: $0 {android|ios|both}"
fi
