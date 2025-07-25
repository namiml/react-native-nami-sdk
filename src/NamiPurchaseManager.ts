import {
  NativeEventEmitter,
  TurboModuleRegistry,
  NativeModules,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiPurchaseManager';
import {
  NamiPurchase,
  NamiPurchasesState,
  NamiRestorePurchasesState,
} from './types';
import { coerceSkuType } from './transformers';

const RNNamiPurchaseManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiPurchaseManager') ??
  NativeModules.RNNamiPurchaseManager;

export enum NamiPurchaseManagerEvents {
  PurchasesChanged = 'PurchasesChanged',
  RestorePurchasesStateChanged = 'RestorePurchasesStateChanged',
}

const emitter = new NativeEventEmitter(NativeModules.RNNamiPurchaseManager);

export const NamiPurchaseManager = {
  emitter,

  allPurchases: async (): Promise<NamiPurchase[]> => {
    const rawPurchases = await RNNamiPurchaseManager.allPurchases();

    return rawPurchases.map((purchase) => ({
      ...purchase,
      purchaseInitiatedTimestamp: new Date(purchase.purchaseInitiatedTimestamp),
      expires: purchase.expires ? new Date(purchase.expires) : undefined,
      sku: purchase.sku
        ? {
            ...purchase.sku,
            type: coerceSkuType(purchase.sku.type),
          }
        : undefined,
    }));
  },

  skuPurchased: async (skuId: string): Promise<boolean> =>
    await RNNamiPurchaseManager.skuPurchased(skuId),

  anySkuPurchased: async (skuIds: string[]): Promise<boolean> =>
    await RNNamiPurchaseManager.anySkuPurchased(skuIds),

  presentCodeRedemptionSheet: (): void =>
    RNNamiPurchaseManager.presentCodeRedemptionSheet(),

  restorePurchases: (): void => RNNamiPurchaseManager.restorePurchases(),

  registerPurchasesChangedHandler: (
    callback: (
      state: NamiPurchasesState,
      purchases: NamiPurchase[],
      error: string,
    ) => void,
  ): (() => void) => {
    const subscription = emitter.addListener(
      NamiPurchaseManagerEvents.PurchasesChanged,
      (event: {
        state: NamiPurchasesState;
        purchases: NamiPurchase[];
        error: string;
      }) => {
        callback(event.state, event.purchases, event.error);
      },
    );
    RNNamiPurchaseManager.registerPurchasesChangedHandler?.();
    return () => subscription.remove();
  },

  registerRestorePurchasesHandler: (
    callback: (
      state: NamiRestorePurchasesState,
      newPurchases: NamiPurchase[],
      oldPurchases: NamiPurchase[],
    ) => void,
  ): (() => void) => {
    const subscription = emitter.addListener(
      NamiPurchaseManagerEvents.RestorePurchasesStateChanged,
      (event: {
        state: NamiRestorePurchasesState;
        newPurchases: NamiPurchase[];
        oldPurchases: NamiPurchase[];
      }) => {
        callback(event.state, event.newPurchases, event.oldPurchases);
      },
    );
    RNNamiPurchaseManager.registerRestorePurchasesHandler?.();
    return () => subscription.remove();
  },
};
