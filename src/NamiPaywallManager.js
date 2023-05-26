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
      () => {
        subscription.remove();
        callback();
      }
    );
    RNNamiPaywallManager.registerBuySkuHandler();
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
      RNNamiPaywallManager.dismiss(animated ?? true, callback ?? (() => {}));
  },

};
