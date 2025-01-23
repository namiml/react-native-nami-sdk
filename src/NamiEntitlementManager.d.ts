import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { NamiEntitlement } from './types';
export declare const RNNamiEntitlementManager: any;
export declare enum NamiEntitlementManagerEvents {
    EntitlementsChanged = "EntitlementsChanged"
}
export interface INamiEntitlementManager {
    emitter: NativeEventEmitter;
    active: () => Promise<Array<NamiEntitlement>>;
    isEntitlementActive: (label: string) => boolean;
    refresh: (resultCallback?: (entitlements?: NamiEntitlement[]) => void) => void;
    registerActiveEntitlementsHandler: (callback: (activeEntitlements: NamiEntitlement[]) => void) => EmitterSubscription['remove'];
    clearProvisionalEntitlementGrants: () => void;
}
export declare const NamiEntitlementManager: INamiEntitlementManager;
