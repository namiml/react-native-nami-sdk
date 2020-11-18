# Analytics Example App

The app shows how to use the analytics callbacks in our React-Native bridge for the Nami SDK.  This example designed to work with Google Analytics, but can be generalized to any third-party analytics service.

## Setup MAC OS

1. Install homebrew `https://brew.sh/`.
2. Install the packages for `node`, `yarn`, and `watchman`.
```
brew install node
brew install watchman
brew install yarn
```
3. Clone the project -> `git clone https://github.com/namiml/react-native-nami-sdk.git`.
4. Navigate to the correct directory -> `cd react-native-nami-sdk/examples/BasicLinkedPaywall`.
5. Install Dependencies -> `yarn install`.

**iOS Setup**

1. Install CocoaPods -> `sudo gem install cocoapods`
2. `cd ios && pod update`
3. Either run `yarn run ios` or `open BasicLinkedPaywall.xcworkspace` and build and run in Xcode.

**Android Setup**

1. Requires Android Studio and an emulator to be installed.
2. Open the the file `android/build.gradle` in Android Studio.
3. Allow gradle to sync and build the project.
4. Return to the terminal and run `yarn run android`.

## Add your Google Analytics config file to the project

In order for this app to send data to your Firebase / Google Analytics project, you need to download and add a configuration file from Google.  Instructions for how to setup Google Analytics are available in [our docs here](https://docs.namiml.com/docs/google-analytics).
