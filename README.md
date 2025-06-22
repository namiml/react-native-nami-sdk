![Nami SDK logo](https://cdn.namiml.com/brand/sdk/Nami-SDK@0.5x.png)

# React Native Bridge for the Nami SDK

Nami ML gives you everything you need to power your paywall, streamline subscription management, and drive revenue growth through instantly deployable paywalls, precise targeting and segmentation, and enterprise-grade security and scaleability.

Go beyond basic IAP and focus on results with:

* Library of smart paywall templates to choose from, implemented natively
* No-code paywall creator so you can launch a new paywall design instantly, without submitting an app update
* Experimentation engine to run paywall A/B tests so you can improve your conversion rates
* Built-in IAP & subscription management and analytics, so you don't need another solution

Nami is simple adopt while giving you the tools you need to improve revenue. Our free tier is generous, and gives you everything you need to get started. [Sign up for a free account](https://app.namiml.com/join/)

Get started by heading over to our [quick start guide](https://learn.namiml.com/public-docs/get-started/quickstart-guide)

## Getting started with React Native and Nami

### Build the Bridge Locally

```
npm run prepare && npm pack
```

This will generate a file `react-native-nami-sdk-vx.x.x.tgz` with the current version number of the bridge.   You can add this to a project by

```
npm install react-native-nami-sdk-vx.x.x.tgz
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

More information on configuring and using the SDK is available in our docs at [https://learn.namiml.com](https://learn.namiml.com).
