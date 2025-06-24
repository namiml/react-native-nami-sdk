import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import type { AccountStateAction, CustomerJourneyState } from './types';
export declare enum NamiCustomerManagerEvents {
  JourneyStateChanged = 'JourneyStateChanged',
  AccountStateChanged = 'AccountStateChanged',
}
export declare const NamiCustomerManager: {
  emitter: NativeEventEmitter;
  login: (customerId: string) => void;
  logout: () => void;
  setCustomerAttribute: (key: string, value: string) => void;
  getCustomerAttribute: (key: string) => Promise<string | undefined>;
  clearCustomerAttribute: (key: string) => void;
  clearAllCustomerAttributes: () => void;
  journeyState: () => Promise<CustomerJourneyState>;
  isLoggedIn: () => Promise<boolean>;
  loggedInId: () => Promise<string | undefined>;
  setCustomerDataPlatformId: (platformId: any) => void;
  clearCustomerDataPlatformId: () => void;
  setAnonymousMode: (anonymousMode: any) => void;
  deviceId: () => Promise<string>;
  inAnonymousMode: () => Promise<boolean>;
  registerJourneyStateHandler: (
    callback: (state: CustomerJourneyState) => void,
  ) => EmitterSubscription['remove'];
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number,
    ) => void,
  ) => EmitterSubscription['remove'];
};
