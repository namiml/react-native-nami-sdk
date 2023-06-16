import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';
import { AccountStateAction, CustomerJourneyState } from './types';

export const { RNNamiCustomerManager } = NativeModules;

export enum NamiCustomerManagerEvents {
  JourneyStateChanged = 'JourneyStateChanged',
  AccountStateChanged = 'AccountStateChanged',
}

export interface INamiCustomerManager {
  emitter: NativeEventEmitter;
  setCustomerAttribute: (key: string, value: string) => void;
  getCustomerAttribute: (key: string) => Promise<string | undefined>;
  clearCustomerAttribute: (key: string) => void;
  clearAllCustomerAttributes: () => void;
  journeyState: () => Promise<CustomerJourneyState | undefined>;
  isLoggedIn: () => Promise<boolean>;
  loggedInId: () => Promise<string | undefined>;
  deviceId: () => Promise<string>;
  login: (
    customerId: string,
    callback?: (success: boolean, error?: number) => void,
  ) => void;
  logout: (callback?: (success: boolean, error?: number) => void) => void;
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void,
  ) => EmitterSubscription['remove'];
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number,
    ) => void,
  ) => EmitterSubscription['remove'];
  clearCustomerDataPlatformId: () => void;
  setCustomerDataPlatformId: (platformId: string) => void;
}

export const NamiCustomerManager: INamiCustomerManager = {
  ...RNNamiCustomerManager,
  emitter: new NativeEventEmitter(RNNamiCustomerManager),
  login: (
    customerId: string,
    callback?: (success: boolean, error?: number) => void,
  ): void => {
    if (Platform.OS === 'ios' || Platform.isTVOS) {
      RNNamiCustomerManager.login(customerId, callback ?? (() => {}));
    } else {
      RNNamiCustomerManager.login(customerId);
    }
  },
  logout: (callback?: (success: boolean, error?: number) => void): void => {
    if (Platform.OS === 'ios' || Platform.isTVOS) {
      RNNamiCustomerManager.logout(callback ?? (() => {}));
    } else {
      RNNamiCustomerManager.logout();
    }
  },
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void,
  ) => {
    const subscription = NamiCustomerManager.emitter.addListener(
      NamiCustomerManagerEvents.JourneyStateChanged,
      callback,
    );
    RNNamiCustomerManager.registerJourneyStateHandler();
    return subscription.remove;
  },
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number,
    ) => void,
  ) => {
    const subscription = NamiCustomerManager.emitter.addListener(
      NamiCustomerManagerEvents.AccountStateChanged,
      (body: any) => {
        const action: AccountStateAction = body.action.toLowerCase();
        const error: number | undefined = body.error;
        const success: boolean = body.success;
        callback(action, success, error);
      },
    );
    RNNamiCustomerManager.registerAccountStateHandler();
    return subscription.remove;
  },
};
