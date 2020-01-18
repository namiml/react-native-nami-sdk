# Analytics Example App

The app shows how to use the analytics callbacks in our React-Native bridge for the Nami SDK.  This example designed to work with Google Analytics, but can be generalized to any third-party analytics service.

## Mac OS Setup
1. Install homebrew `https://brew.sh/`.
2. Add the packages for `node`, `yarn`, and `watchman`. and `cocoapods` install in your machine
```
`brew install node`
`brew install watchman`
`brew install yarn`
```
3. Install CocoaPods -> `sudo gem install cocoapods`
4. Clone the project -> `git clone https://github.com/namiml/react-native-nami-sdk.git`.
5. Navigate to the correct directory -> `cd react-native-nami-sdk/examples/Analytics`.
6. Install Dependencies -> `yarn install`.
7. Setup ios -> `yarn run ios-setup`.
8. Run app in IOS Xcode -> `yarn run ios`

If you encounter any errors, trying running a clean build of the project with `yar run ios-setup-clean`.

## Add your Google Analytics config file to the project

In order for this app to send data to your Firebase / Google Analytics project, you need to download and add a configuration file from Google.  Instructions for how to setup Google Analytics are available in [our docs here](https://docs.namiml.com/docs/google-analytics).

## Run tests

You can run tests by running: `yarn test`.

## Debugging in Mac OS

If port 8081 is already in use, run the following to find what is running on port 8081.

```
sudo lsof -i :8081
```

You can terminate the process via

```
kill -9 <PID>
```
