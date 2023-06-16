#!/bin/bash

function run_ios() {
    if [ -z "$2" ]; then
        echo "Starting iOS app..."
        react-native run-ios
    elif [ "$2" == "device" ]; then
        echo "Starting iOS app on connected device..."
        react-native run-ios --device
    else
        echo "Starting iOS app on simulator $2..."
        react-native run-ios --simulator="$2"
    fi
}

function run_android() {
    if [ -z "$2" ]; then
        echo "Starting Android app..."
        react-native run-android --variant=productionDebug
    else
        echo "Starting Android app on device $2..."
        react-native run-android --deviceId="$2" --variant=productionDebug
    fi
}

if [ "$1" == "ios" ]; then
    run_ios "$@"
elif [ "$1" == "android" ]; then
    run_android "$@"
else
    echo "Unknown command: $1"
    echo "Usage: $0 {ios [simulatorName|device]|android [deviceId]}"
fi
