import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const { NamiEmitter, NamiPaywallManagerBridge } = NativeModules;

const RNNamiPaywallManager =
  Platform.OS == "ios" ? NativeModules.RNNamiPaywallManager : {};

export const NamiPaywallManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  paywallEmitter:
    Platform.OS == "ios" ? new NativeEventEmitter(RNNamiPaywallManager) : null,
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
  registerCloseHandler(callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "BlockingPaywallClosed",
      callback
    );
    RNNamiPaywallManager.registerCloseHandler();
    return subscription.remove;
  },
  registerCloseHandler(callback) {
    var subscription;
    subscription = this.paywallEmitter.addListener(
      "BlockingPaywallClosed",
      callback
    );
    NamiPaywallManagerBridge.registerCloseHandler();
    return subscription.remove;
  },
};
