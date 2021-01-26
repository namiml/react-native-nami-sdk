![Nami SDK logo](https://nami-brand.s3.amazonaws.com/images/Nami.SDK.RGB.Color.120x120.png)

# React Native Bridge for the Nami SDK

Nami is the smartest way to sell subscriptions.  Our SDK is built for the subscription economy, providing an end-to-end solution powered by on-device machine learning to accelerate your in-app purchases.

The Nami SDK takes care of platform specific implementation details to offer in-app purchases so you can focus on building your core app experience.

## Getting started with React Native and Nami

### Build the Bridge Locally

```
yarn pack
```

This will generate a file `react-native-nami-sdk-vx.x.x.tgz` with the current version number of the bridge.   You can add this to a project by

```
yarn add file:react-native-nami-sdk-vx.x.x.tgz
```

### Installing from NPM

The bridge is also available as a package on NPM.  You can install it via yarn or npm

```
npm install react-native-nami-sdk --save
```

```
yarn add react-native-nami-sdk
```

Example apps showing how to use the bridge are available in this repository in the [examples directory](https://github.com/namiml/react-native-nami-sdk/tree/master/examples), including instructions on how to build the apps.

More information on configuring and using the SDK is available in our docs at [https://docs.namiml.com](https://docs.namiml.com).
