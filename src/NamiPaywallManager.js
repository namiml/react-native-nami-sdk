import { NativeModules, NativeEventEmitter } from "react-native";

const { NamiPaywallManagerBridge, RNNamiPaywallManager } = NativeModules;

export const NamiPaywallManager = {
  paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  buySkuCompleteApple(purchaseSuccess) {
    RNNamiPaywallManager.buySkuComplete(purchaseSuccess);
  },
  buySkuCompleteAmazon(purchaseSuccess) {
    RNNamiPaywallManager.buySkuComplete(purchaseSuccess, "Amazon");
  },
  buySkuCompleteGooglePlay(purchaseSuccess) {
    RNNamiPaywallManager.buySkuComplete(purchaseSuccess, "GooglePlay");
  },
  registerBuySkuHandler(callback) {
    var subscription = this.paywallEmitter.addListener(
      "RegisterBuySKU",
      callback
    );
    RNNamiPaywallManager.registerBuySkuHandler();
    return subscription.remove;
  },
  registerCloseHandler(callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "PaywallCloseRequested",
      () => {
        subscription.remove();
        callback();
      }
    );
    RNNamiPaywallManager.registerCloseHandler();
  },
  dismiss(animated, callback) {
      RNNamiPaywallManager.dismiss(animated, callback ?? (() => {}));
  },
  dismiss(animated) {
      RNNamiPaywallManager.dismiss(animated, (() => {}));
  },

};
