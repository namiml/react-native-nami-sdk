import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import type { AccountStateAction, CustomerJourneyState } from './types';
export declare enum NamiCustomerManagerEvents {
    JourneyStateChanged = "JourneyStateChanged",
    AccountStateChanged = "AccountStateChanged"
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
    deviceId: () => Promise<string>;
    clearCustomerDataPlatformId: () => void;
    setCustomerDataPlatformId: (platformId: string) => void;
    setAnonymousMode: (anonymousMode: boolean) => void;
    inAnonymousMode: () => Promise<boolean>;
    registerJourneyStateHandler: (callback: (state: CustomerJourneyState) => void) => EmitterSubscription["remove"];
    registerAccountStateHandler: (callback: (action: AccountStateAction, success: boolean, error?: number) => void) => EmitterSubscription["remove"];
};
