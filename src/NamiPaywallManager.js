import { NativeModules, NativeEventEmitter } from "react-native";

const { NamiPaywallManagerBridge, RNNamiPaywallManager } = NativeModules;

export const NamiPaywallManager = {
  paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  buySkuCompleteIos(purchaseSuccess) {
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
  registerCloseHandler(blockDismiss, callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "BlockingPaywallClosed",
      () => {
        subscription.remove();
        callback();
      }
    );
    RNNamiPaywallManager.registerCloseHandler(blockDismiss);
  },
};
