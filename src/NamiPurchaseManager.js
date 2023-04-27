import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const { NamiPurchaseManagerBridge, NamiEmitter } = NativeModules;

const RNNamiPurchaseManager =
  Platform.OS == "ios" ? NativeModules.RNNamiPurchaseManager : {};

export const NamiPurchaseManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  ...RNNamiPurchaseManager,
  ...NamiPurchaseManagerBridge,
  registerPurchasesChangedHandler(callback) {
    const subscription = this.emitter.addListener("PurchasesChanged", callback);
    NamiPurchaseManagerBridge.registerPurchasesChangedHandler();
    return subscription.remove;
  },
  registerRestorePurchasesHandler(callback) {
    const subscription = this.emitter.addListener(
      "RestorePurchasesStateChanged",
      callback
    );
    // NamiPurchaseManagerBridge.restorePurchasesWithCompletionHandler();
    return subscription.remove;
  },
};
