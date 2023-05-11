import { NativeModules, NativeEventEmitter, Platform } from "react-native";

export const { RNNamiEntitlementManager } = NativeModules;

export const NamiEntitlementManager = {
  emitter: new NativeEventEmitter(RNNamiEntitlementManager),
  ...RNNamiEntitlementManager,
  refresh(resultCallback) {
    if (Platform.OS === "android") {
      RNNamiEntitlementManager.refresh(resultCallback ?? (() => {}));
    } else {
      RNNamiEntitlementManager.refresh();
    }
  },
  registerActiveEntitlementsHandler(callback) {
    const subscription = this.emitter.addListener(
      "EntitlementsChanged",
      callback
    );
    RNNamiEntitlementManager.registerActiveEntitlementsHandler();
    return subscription.remove;
  },
};
