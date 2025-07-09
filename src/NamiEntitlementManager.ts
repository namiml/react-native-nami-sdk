import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiEntitlementManager';
import type { NamiEntitlement } from './types';
import { parsePurchaseDates } from './transformers';

const RNNamiEntitlementManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiEntitlementManager') ??
  NativeModules.RNNamiEntitlementManager;

const emitter = new NativeEventEmitter(NativeModules.RNNamiEntitlementManager);

export enum NamiEntitlementManagerEvents {
  EntitlementsChanged = 'EntitlementsChanged',
}

function parseEntitlements(entitlements: any[]): NamiEntitlement[] {
  return entitlements.map((ent) => ({
    ...ent,
    activePurchases: ent.activePurchases.map(parsePurchaseDates),
    relatedSkus: ent.relatedSkus ?? [],
    purchasedSkus: ent.purchasedSkus ?? [],
  }));
}

export const NamiEntitlementManager = {
  emitter,

  active: async (): Promise<NamiEntitlement[]> => {
    const raw = await RNNamiEntitlementManager.active();
    return parseEntitlements(raw);
  },

  isEntitlementActive: async (entitlementId: string): Promise<boolean> => {
    return await RNNamiEntitlementManager.isEntitlementActive(entitlementId);
  },

  refresh: (
    callback: (entitlements: NamiEntitlement[]) => void,
  ): EmitterSubscription['remove'] => {
    const subscription = emitter.addListener(
      NamiEntitlementManagerEvents.EntitlementsChanged,
      callback,
    );
    RNNamiEntitlementManager.refresh?.();
    return () => subscription.remove();
  },

  registerActiveEntitlementsHandler: (
    callback: (entitlements: NamiEntitlement[]) => void,
  ): EmitterSubscription['remove'] => {
    const subscription = emitter.addListener(
      NamiEntitlementManagerEvents.EntitlementsChanged,
      callback,
    );
    RNNamiEntitlementManager.registerActiveEntitlementsHandler?.();
    return () => subscription.remove();
  },

  clearProvisionalEntitlementGrants: (): void =>
    RNNamiEntitlementManager.clearProvisionalEntitlementGrants(),
};
