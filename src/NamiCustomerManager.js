import { NativeModules, NativeEventEmitter, Platform } from "react-native";

export const { RNNamiCustomerManager } = NativeModules;

export const NamiCustomerManager = {
  emitter: new NativeEventEmitter(RNNamiCustomerManager),
  ...RNNamiCustomerManager,
  login: (customerId, callback) => {
    if (Platform.OS === "ios") {
      RNNamiCustomerManager.login(customerId, callback ?? (() => {}));
    } else {
      RNNamiCustomerManager.login(customerId);
    }
  },
  logout: (callback) => {
    if (Platform.OS === "ios") {
      RNNamiCustomerManager.logout(callback ?? (() => {}));
    } else {
      RNNamiCustomerManager.logout();
    }
  },
  registerJourneyStateHandler(callback) {
    const subscription = this.emitter.addListener(
      "JourneyStateChanged",
      callback
    );
    RNNamiCustomerManager.registerJourneyStateHandler();
    return subscription.remove;
  },
  registerAccountStateHandler(callback) {
    const subscription = this.emitter.addListener(
      "AccountStateChanged",
      (body) => {
        var action = body.action.toLowerCase();
        var error = body.error;
        var success = body.success;
        callback(action, success, error);
      }
    );
    RNNamiCustomerManager.registerAccountStateHandler();
    return subscription.remove;
  },
};
