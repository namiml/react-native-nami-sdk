import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiEntitlementManager';
import type { NamiEntitlement } from './types';

const RNNamiEntitlementManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiEntitlementManager') ??
  NativeModules.RNNamiEntitlementManager;

const emitter = new NativeEventEmitter(NativeModules.RNNamiEntitlementManager);

export enum NamiEntitlementManagerEvents {
  EntitlementsChanged = 'EntitlementsChanged'
}

export const NamiEntitlementManager = {
  emitter,

  active: async (): Promise<NamiEntitlement[]> => {
    return await RNNamiEntitlementManager.active();
  },

  isEntitlementActive: async (entitlementId: string): Promise<boolean> => {
    return await RNNamiEntitlementManager.isEntitlementActive(entitlementId);
  },

  refresh: async (): Promise<void> => {
    return await RNNamiEntitlementManager.refresh();
  },

  registerActiveEntitlementsHandler: (
    callback: (entitlements: NamiEntitlement[]) => void
  ): EmitterSubscription['remove'] => {
    const subscription = emitter.addListener(
      NamiEntitlementManagerEvents.EntitlementsChanged,
      callback
    );
    RNNamiEntitlementManager.registerActiveEntitlementsHandler?.();
    return () => subscription.remove();
  },
};
