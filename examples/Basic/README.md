# Basic Example App
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
4. Pack the SDK
   - `rm react-native-nami-sdk*.tgz`
   - `npm pack`
4. Navigate to the correct directory -> `cd react-native-nami-sdk/examples/Basic`.
5. Install Dependencies ->
   - `npm install ../../react-native-nami-sdk*.tgz`
   - `rm -rf node_modules ; yarn install`
   - `rm -rf node_modules/react-native-nami-sdk/examples ; npx react-native start --reset-cache`

**iOS Setup**

1. Install CocoaPods -> `brew install cocoapods`
2. `cd ios && rm -rf Pods Podfile.lock && RCT_NEW_ARCH_ENABLED=0 SWIFT_VERSION=5 pod install`
3. Either run `yarn run ios` or `open Basic.xcworkspace` and build in Xcode.
4. Local detox tests: `detox clean-framework-cache && detox build --configuration ios.sim.debug && detox build-framework-cache && yarn detox test --configuration ios.sim.debug  e2e/ios --cleanup --headless --record-logs all`


**Android Setup**

1. Requires Android Studio and an emulator to be installed.
2. Open the the file `android/build.gradle` in Android Studio.
3. Allow gradle to sync and build the project.
4. Return to the terminal and run `npx react-native run-android --variant=productionDebug`
