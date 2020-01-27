# Basic Example App
The folder contains a simple example app that shows how to use the React-Native bridge with the Nami SDK.

## Setup MAC OS
1. Install homebrew `https://brew.sh/`.
2. Add the packages for `node`, `yarn`, and `watchman`. and `cocoapods` install in your machine
```
`brew install node`
`brew install watchman`
`brew install yarn`
```
3. Install CocoaPods -> `sudo gem install cocoapods`
4. Clone the project -> `git clone https://github.com/namiml/react-native-nami-sdk.git`.
5. Navigate to the correct directory -> `cd react-native-nami-sdk/examples/Basic`.
6. Install Dependencies -> `yarn install`.
7. Setup ios -> `yarn run ios-setup`.
8. Run app in IOS Xcode -> `yarn run ios`

If you encounter any errors, trying running a clean build of the project with `yar run ios-setup-clean`.

## Run tests

You can run tests by running: `yarn test`

## Debugging in Mac OS

If you receive an error about port 8081 already being in use, run the following command to find what is running on port 8081.

```
`sudo lsof -i :8081`
```

You can terminate the running process via

```
`kill -9 <PID>`
```
