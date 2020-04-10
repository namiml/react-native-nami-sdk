# Basic Example App
The folder contains a simple example app that shows how to use the React-Native bridge with the Nami SDK.

## Setup MAC OS

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

**iOS Setup**

1. Install CocoaPods -> `sudo gem install cocoapods`
2. `cd ios && pod update`
3. `open Basic.xcworkspace`
4. In XCode, open up the Pods project, go into the Pods/Nami/Frameworks folder.  Click on the Nami.xcframework file.
5. Open the sidebar in Xcode and look for the react-native-nami-sdk target membership.  If this is not checked, check this box.

![XCode Setup](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/374528e3-1560-4153-a0c5-b2e7d7e8fbc0/Screen_Shot_2020-04-09_at_9.56.40_AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20200410%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200410T021225Z&X-Amz-Expires=86400&X-Amz-Signature=60b67a6f14cc48280ee32131ced5ff315eedbadda1f57e7bd67630e45362ac3b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Screen_Shot_2020-04-09_at_9.56.40_AM.png%22)

6. Build and run the app in XCode.

**Android Setup**

1. Requires Android Studio and an emulator to be installed.
2. Open the the file `android/build.gradle` in Android Studio.
3. Allow gradle to sync and build the project.
4. Return to the terminal and run `yarn run android`.
