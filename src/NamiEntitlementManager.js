import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiEntitlementManager } = NativeModules;

export const NamiEntitlementManager = {
  emitter: new NativeEventEmitter(RNNamiEntitlementManager),
  ...RNNamiEntitlementManager,
  // registerActiveEntitlementsHandler(callback) {
  //   const subscription = this.emitter.addListener(
  //     "EntitlementsChanged",
  //     callback
  //   );
  //   RNNamiEntitlementManager.registerActiveEntitlementsHandler();
  //   return subscription.remove;
  // },
};
