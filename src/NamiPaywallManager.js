import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const { NamiEmitter, NamiPaywallManagerBridge, RNNamiPaywallManager } =
  NativeModules;

export const NamiPaywallManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  registerBuySkuHandler(callback) {
    var subscription;
    if (Platform.OS == "ios") {
      subscription = this.paywallEmitter.addListener(
        "RegisterBuySKU",
        callback
      );
    } else {
      subscription = this.emitter.addListener("RegisterBuySKU", callback);
    }
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
