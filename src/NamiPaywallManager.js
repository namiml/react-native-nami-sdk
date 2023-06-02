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
      (sku) => {
        callback(sku);
      }
    );
    RNNamiPaywallManager.registerBuySkuHandler();
    return subscription.remove;
  },
  registerCloseHandler(callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "PaywallCloseRequested",
      (body) => {
        callback(body);
      }
    );
    RNNamiPaywallManager.registerCloseHandler();
    return subscription.remove;
  },
  dismiss(animated) {
    RNNamiPaywallManager.dismiss(animated ?? true);
  },
};
