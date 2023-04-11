import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiCustomerManager } = NativeModules;

export const NamiCustomerManager = {
  // emitter: new NativeEventEmitter(RNNamiCustomerManager),
  ...RNNamiCustomerManager,
  login: (customerId, callback) => {
    RNNamiCustomerManager.login(customerId, callback ?? (() => {}));
  },
  logout: (callback) => {
    RNNamiCustomerManager.logout(callback ?? (() => {}));
  },
  // registerJourneyStateHandler(callback) {
  //   const subscription = this.emitter.addListener(
  //     "JourneyStateChanged",
  //     callback
  //   );
  //   RNNamiCustomerManager.registerJourneyStateHandler();
  //   return subscription.remove;
  // },
  // registerAccountStateHandler(callback) {
  //   const actions = ["login", "logout"];
  //   const subscription = this.emitter.addListener(
  //     "AccountStateChanged",
  //     (body) => callback(actions[body[0]], body[1], body[2])
  //   );
  //   RNNamiCustomerManager.registerAccountStateHandler();
  //   return subscription.remove;
  // },
};
