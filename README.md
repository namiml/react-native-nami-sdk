![Nami SDK logo](https://nami-brand.s3.amazonaws.com/images/Nami.SDK.RGB.Color.120x120.png)

# React Native Bridge for the Nami SDK

Nami is the smartest way to sell subscriptions.  Our SDK is built for the subscription economy, providing an end-to-end solution powered by on-device machine learning to accelerate your in-app purchases.

The Nami SDK takes care of platform specific implementation details to offer in-app purchases so you can focus on building your core app experience.

**Note we only currently support iOS.  Android coming soon!**

## Getting started with React Native and iOS

Our bridge code is available as an NPM package.  To get started, simply install the package and if necessary add a yarn script for building the iOS app.

1. `npm install react-native-nami-sdk --save` or `yarn add react-native-nami-sdk`
2. Ensure your **package.json** file has a script similar to `"ios-setup": "cd ios && pod install"`
3. Build the project with either NPM or yarn: `npm run ios-setup` or `yarn run ios-setup`
4. Run your app in the iOS simulator: `npm run ios` or `yarn run ios`

Examples of how to use the Nami SDK can be found in the [examples directory](https://github.com/namiml/react-native-nami-sdk/tree/master/examples) of the github repository.

More information on configuring and using the SDK is available in our docs at [https://docs.namiml.com](https://docs.namiml.com).
