import { NativeModules, NativeEventEmitter } from "react-native";

export const {
  NamiEmitter,
  NamiPaywallManagerBridge,
  //  RNNamiPaywallManager
} = NativeModules;

export const NamiPaywallManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  // paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  // ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  // registerBuySkuHandler(callback) {
  //   const subscription = this.paywallEmitter.addListener(
  //     "RegisterBuySKU",
  //     callback
  //   );
  //   NamiPaywallManagerBridge.registerBuySkuHandler();
  //   return subscription.remove;
  // },
};
