#!/bin/bash

# Possible commands:
# yarn detox:
# build ios debug
# test ios debug
# build ios release
# test ios release
# build android debug
# test android debug
# build android release
# test android release

# Assigning command line arguments to variables
action=$1   # build or test
platform=$2 # android or ios
config=$3   # debug or release

# Check if the NODE_OPTIONS environment variable is set to --openssl-legacy-provider
# If not, then set it
if [[ $NODE_OPTIONS != "--openssl-legacy-provider" ]]; then
  export NODE_OPTIONS=--openssl-legacy-provider
fi

# Validate the inputs
if [[ $action != "build" && $action != "test" ]]; then
  echo "Invalid action. Choose 'build' or 'test'."
  exit 1
fi

if [[ $platform != "android" && $platform != "ios" ]]; then
  echo "Invalid platform. Choose 'android' or 'ios'."
  exit 1
fi

if [[ $config != "debug" && $config != "release" ]]; then
  echo "Invalid config. Choose 'debug' or 'release'."
  exit 1
fi

# Based on the platform, set the configuration
if [[ $platform == "android" ]]; then
  configuration="android.emu.$config"
else
  configuration="ios.sim.$config"
fi

# Execute the detox command
detox "$action" --configuration "$configuration" e2e/"$platform" --cleanup --headless --record-logs all
