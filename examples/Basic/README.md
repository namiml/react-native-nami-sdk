# Basic Example
React-Native bridge for the Nami SDK Basic Example

## Setup MAC OS
1- install brew `https://brew.sh/`
2- you need to have `node`, `yarn`, `watchman` and `cocoapods` install in your machine
- `brew install node`
- `brew install watchman`
- `brew install yarn`
- `sudo gem install cocoapods`

3- clone the project -> `git clone https://github.com/namiml/react-native-nami-sdk.git`

4- Go into the project -> `cd react-native-nami-sdk/examples/BasicExample`

5- Install Dependencies -> `yarn install`

6- setup ios app pod -> `yarn run ios-setup`

7- Run app in IOS Xcode -> `yarn run ios`

## Run test

you can run test by running: `yarn test`

## Debugging in Mac OS
if something goes wrong while running the project try running 
_`yarn run ios-setup-clean`

if port 8081 is already in use run the following to find what is running on port 8081
_ `sudo lsof -i :8081`
Then run the following to terminate the process 
_ `kill -9 <PID>`

## Setup Windows 
`COMING SOON`
