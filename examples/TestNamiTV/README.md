# Basic Example App - Connected TV
The folder contains a simple example app that shows how to use the React-Native bridge with the Nami SDK.

## Setup macOS

1. Install homebrew `https://brew.sh/`.
2. Install the packages for `node`, `yarn`, and `watchman`.
```
brew install node
brew install watchman
brew install yarn
```
3. Clone the project -> `git clone https://github.com/namiml/react-native-nami-sdk.git`.
4. Navigate to the correct directory -> `cd react-native-nami-sdk/examples/Basic`.
5. Install Dependencies -> `yarn install`.

**tvOS Setup**

1. Install CocoaPods -> `sudo gem install cocoapods`
2. `cd ios && pod update`
3. Either run `yarn run ios` or `open Basic.xcworkspace` and build in Xcode.
4. Build the Basic-tvOS target

**Android Setup**

1. Requires Android Studio and an emulator to be installed.
2. Open the the file `android/build.gradle` in Android Studio.
3. Allow gradle to sync and build the project.
4. Return to the terminal and run `yarn run android`.
