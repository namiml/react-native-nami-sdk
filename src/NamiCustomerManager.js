import { NativeModules, NativeEventEmitter } from 'react-native';

export const { RNNamiCustomerManager } = NativeModules;

export const NamiCustomerManager = {
  emitter: new NativeEventEmitter(RNNamiCustomerManager),
  ...RNNamiCustomerManager,
  login: customerId => {
    RNNamiCustomerManager.login(customerId);
  },
  logout: () => {
    RNNamiCustomerManager.logout();
  },
  registerJourneyStateHandler(callback) {
    const subscription = this.emitter.addListener(
      'JourneyStateChanged',
      callback,
    );
    RNNamiCustomerManager.registerJourneyStateHandler();
    return subscription.remove;
  },
  registerAccountStateHandler(callback) {
    const subscription = this.emitter.addListener(
      'AccountStateChanged',
      body => {
        var action = body.action.toLowerCase();
        var error = body.error;
        var success = body.success;
        callback(action, success, error);
      },
    );
    RNNamiCustomerManager.registerAccountStateHandler();
    return subscription.remove;
  },
};
