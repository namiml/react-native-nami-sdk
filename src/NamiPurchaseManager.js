import { NativeModules, NativeEventEmitter, Platform } from "react-native";

const { NamiPurchaseManagerBridge, NamiEmitter } = NativeModules;

const RNNamiPurchaseManager =
  Platform.OS == "ios" ? NativeModules.RNNamiPurchaseManager : {};

export const NamiPurchaseManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  ...RNNamiPurchaseManager,
  ...NamiPurchaseManagerBridge,
  registerPurchasesChangedHandler(callback) {
    const subscription = this.emitter.addListener(
      "PurchasesChanged",
      (body) => {
        var purchases = body.purchases;
        var purchaseState = body.purchaseState.toLowerCase();
        var error = body.error;
        callback(purchaseState, purchases, error);
      }
    );
    RNNamiPurchaseManager.registerPurchasesChangedHandler();
    return subscription.remove;
  },
  registerRestorePurchasesHandler(callback) {
    const subscription = this.emitter.addListener(
      "RestorePurchasesStateChanged",
      (body) => {
        var state = body.state.toLowerCase();
        var newPurchases = body.newPurchases;
        var oldPurchases = body.oldPurchases;
        callback(state, newPurchases, oldPurchases);
      }
    );
    RNNamiPurchaseManager.registerRestorePurchasesHandler();
    return subscription.remove;
  },
};
