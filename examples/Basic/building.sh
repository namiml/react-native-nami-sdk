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

# For production debug flavor on an emulator: yarn b android prod debug
# For staging release flavor on an emulator: yarn b android staging release
function run_android() {
    if [ "$2" == "prod" ]; then
        variant="production"
    elif [ "$2" == "staging" ]; then
        variant="staging"
    else
        echo "Invalid environment. Choose either prod or staging."
        exit 1
    fi

    if [ "$3" == "debug" ]; then
        variant="${variant}Debug"
    elif [ "$3" == "release" ]; then
        variant="${variant}Release"
    else
        echo "Invalid type. Choose either debug or release."
        exit 1
    fi

    if [ -z "$4" ]; then
        echo "Starting Android app..."
        react-native run-android --variant=$variant
    elif [ "$4" == "d" ]; then
        echo "Starting Android app on device..."
        react-native run-android --deviceId="$5" --variant=$variant
    else
        echo "Invalid command. To run on a device, use the 'd' command."
        exit 1
    fi
}

if [ "$1" == "ios" ]; then
    run_ios "$@"
elif [ "$1" == "android" ]; then
    run_android "$@"
else
    echo "Unknown command: $1"
    echo "Usage: $0 {ios [simulatorName|device]|android [prod|staging] [debug|release] [d deviceId]}"
fi
