![Nami SDK logo](https://cdn.namiml.com/brand/sdk/Nami-SDK@0.5x.png)

# React Native Bridge for the Nami SDK

Nami is easy subscriptions & in-app purchases, with powerful built-in paywalls and A/B testing.

 This library helps you easily offer in-app purchases and subscriptions using Apple App Store StoreKit & Google Play Billing APIs.
  - No IAP code to write.
  - Focus on your app experience.
  - All edge cases are handled and no server is required.
  - Includes is powerful built-in paywalls templates, built with native SwiftUI and Jetpack Compose
  - Update paywalls easily using a browser-based paywall CMS.
  - Conduct paywall A/B tests, to improve your conversion rate.
  - Robust subscription analytics, webhooks, and much more.

Requires an account with Nami. The free tier is generous and includes everything you need to get up and running.

See https://www.namiml.com for more details and to create a free account.

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
