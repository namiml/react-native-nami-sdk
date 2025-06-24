import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiCustomerManager';
import type {
  AccountStateAction,
  CustomerJourneyState,
  NamiAccountStateEvent,
} from './types';

const RNNamiCustomerManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiCustomerManager') ??
  NativeModules.RNNamiCustomerManager;

const emitter = new NativeEventEmitter(NativeModules.RNNamiCustomerManager);

export enum NamiCustomerManagerEvents {
  JourneyStateChanged = 'JourneyStateChanged',
  AccountStateChanged = 'AccountStateChanged',
}

export const NamiCustomerManager = {
  emitter,

  login: (customerId: string) => RNNamiCustomerManager.login(customerId),

  logout: () => RNNamiCustomerManager.logout(),

  setCustomerAttribute: (key: string, value: string) =>
    RNNamiCustomerManager.setCustomerAttribute(key, value),

  getCustomerAttribute: async (key: string): Promise<string | undefined> => {
    const value = await RNNamiCustomerManager.getCustomerAttribute(key);
    return value ?? undefined;
  },

  clearCustomerAttribute: (key: string) =>
    RNNamiCustomerManager.clearCustomerAttribute(key),

  clearAllCustomerAttributes: () =>
    RNNamiCustomerManager.clearAllCustomerAttributes(),

  journeyState: async (): Promise<CustomerJourneyState> =>
    RNNamiCustomerManager.journeyState() as Promise<CustomerJourneyState>,

  isLoggedIn: async (): Promise<boolean> => RNNamiCustomerManager.isLoggedIn(),

  loggedInId: async (): Promise<string | undefined> => {
    const id = await RNNamiCustomerManager.loggedInId();
    return id ?? undefined;
  },
  setCustomerDataPlatformId: (platformId) => {
    RNNamiCustomerManager.setCustomerDataPlatformId(platformId);
  },
  clearCustomerDataPlatformId: () => {
    RNNamiCustomerManager.clearCustomerDataPlatformId();
  },
  setAnonymousMode: (anonymousMode) => {
    RNNamiCustomerManager.setAnonymousMode(anonymousMode);
  },
  deviceId: async () => {
    return RNNamiCustomerManager.deviceId();
  },
  inAnonymousMode: async () => {
    return RNNamiCustomerManager.inAnonymousMode();
  },
  registerJourneyStateHandler: (
    callback: (state: CustomerJourneyState) => void,
  ): EmitterSubscription['remove'] => {
    const subscription = emitter.addListener(
      NamiCustomerManagerEvents.JourneyStateChanged,
      callback,
    );
    RNNamiCustomerManager.registerJourneyStateHandler?.();
    return () => subscription.remove();
  },

  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number,
    ) => void,
  ): EmitterSubscription['remove'] => {
    const subscription = emitter.addListener(
      NamiCustomerManagerEvents.AccountStateChanged,
      (body: NamiAccountStateEvent) => {
        const action: AccountStateAction = body.action.toLowerCase();
        callback(action, body.success, body.error);
      },
    );
    RNNamiCustomerManager.registerAccountStateHandler?.();
    return () => subscription.remove();
  },
};
