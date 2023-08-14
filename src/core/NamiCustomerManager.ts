import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

import type { AccountStateAction, CustomerJourneyState } from '../types';

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
  login: (customerId: string) => void;
  logout: () => void;
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void
  ) => EmitterSubscription['remove'];
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number
    ) => void
  ) => EmitterSubscription['remove'];
  clearCustomerDataPlatformId: () => void;
  setCustomerDataPlatformId: (platformId: string) => void;
  setAnonymousMode: (anonymousMode: boolean) => void;
  inAnonymousMode: () => Promise<boolean>;
}

export const NamiCustomerManager: INamiCustomerManager = {
  ...RNNamiCustomerManager,
  emitter: new NativeEventEmitter(RNNamiCustomerManager),
  login: (customerId) => {
    RNNamiCustomerManager.login(customerId);
  },
  logout: () => {
    RNNamiCustomerManager.logout();
  },
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void
  ) => {
    const subscription = NamiCustomerManager.emitter.addListener(
      NamiCustomerManagerEvents.JourneyStateChanged,
      callback
    );
    RNNamiCustomerManager.registerJourneyStateHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number
    ) => void
  ) => {
    const subscription = NamiCustomerManager.emitter.addListener(
      NamiCustomerManagerEvents.AccountStateChanged,
      (body: any) => {
        const action: AccountStateAction = body.action.toLowerCase();
        const error: number | undefined = body.error;
        const success: boolean = body.success;
        callback(action, success, error);
      }
    );
    RNNamiCustomerManager.registerAccountStateHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
};
