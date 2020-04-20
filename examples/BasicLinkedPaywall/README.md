# BasicLinkedPaywall Example App

The folder contains a simple example app that shows how to use the React-Native bridge with the Nami SDK.  In particular, this example shows how to build a custom paywall as a component in your React Native app while dynamically loading data from the Nami Control Center.

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
3. `open BasicLinkedPaywall.xcworkspace`
4. In XCode, open up the Pods project, go into the Pods/Nami/Frameworks folder.  Click on the Nami.xcframework file.
5. Open the sidebar in Xcode and look for the react-native-nami-sdk target membership.  If this is not checked, check this box.

![XCode Setup](https://nami-public-web.s3.us-east-2.amazonaws.com/react-native-xcode-setup.png)

6. Build and run the app in XCode.

**Android Setup**

1. Requires Android Studio and an emulator to be installed.
2. Open the the file `android/build.gradle` in Android Studio.
3. Allow gradle to sync and build the project.
4. Return to the terminal and run `yarn run android`.
