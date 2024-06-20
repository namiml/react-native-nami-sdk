import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { AccountStateAction, CustomerJourneyState } from './types';
export declare const RNNamiCustomerManager: any;
export declare enum NamiCustomerManagerEvents {
    JourneyStateChanged = "JourneyStateChanged",
    AccountStateChanged = "AccountStateChanged"
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
    registerJourneyStateHandler: (callback: (journeyState: CustomerJourneyState) => void) => EmitterSubscription['remove'];
    registerAccountStateHandler: (callback: (action: AccountStateAction, success: boolean, error?: number) => void) => EmitterSubscription['remove'];
    clearCustomerDataPlatformId: () => void;
    setCustomerDataPlatformId: (platformId: string) => void;
    setAnonymousMode: (anonymousMode: boolean) => void;
    inAnonymousMode: () => Promise<boolean>;
}
export declare const NamiCustomerManager: INamiCustomerManager;
