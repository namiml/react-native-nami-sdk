import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import type { NamiEntitlement } from './types';
export declare enum NamiEntitlementManagerEvents {
    EntitlementsChanged = "EntitlementsChanged"
}
export declare const NamiEntitlementManager: {
    emitter: NativeEventEmitter;
    active: () => Promise<NamiEntitlement[]>;
    isEntitlementActive: (entitlementId: string) => Promise<boolean>;
    refresh: (callback: (entitlements: NamiEntitlement[]) => void) => EmitterSubscription["remove"];
    registerActiveEntitlementsHandler: (callback: (entitlements: NamiEntitlement[]) => void) => EmitterSubscription["remove"];
    clearProvisionalEntitlementGrants: () => void;
};
