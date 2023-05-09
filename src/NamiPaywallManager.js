import { NativeModules, NativeEventEmitter } from "react-native";

const { NamiPaywallManagerBridge, RNNamiPaywallManager } = NativeModules;

export const NamiPaywallManager = {
  paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  registerBuySkuHandler(callback) {
    var subscription = this.paywallEmitter.addListener(
      "RegisterBuySKU",
      callback
    );
    RNNamiPaywallManager.registerBuySkuHandler();
    return subscription.remove;
  },
  registerCloseHandler(blockDismiss, callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "BlockingPaywallClosed",
      callback,
      () => {
        subscription.remove();
        callback();
      }
    );
    RNNamiPaywallManager.registerCloseHandler(blockDismiss);
  },
};
