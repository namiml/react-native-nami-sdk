import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { EmitterSubscription } from 'react-native';
import {
  NamiPurchase,
  NamiPurchasesState,
  NamiRestorePurchasesState,
} from './types';

export const { NamiPurchaseManagerBridge, RNNamiPurchaseManager } =
  NativeModules;

export enum NamiPurchaseManagerEvents {
  PurchasesChanged = 'PurchasesChanged',
  RestorePurchasesStateChanged = 'RestorePurchasesStateChanged',
}

export interface INamiPurchaseManager {
  emitter: NativeEventEmitter;
  allPurchases: () => NamiPurchase[];
  anySkuPurchased: (skuIds: string[]) => boolean;
  consumePurchasedSku: (skuId: string) => void;
  presentCodeRedemptionSheet: () => void;
  restorePurchases: (
    callback: (
      purchaseState: NamiPurchasesState,
      purchases: NamiPurchase[],
      error: string,
    ) => void,
  ) => EmitterSubscription['remove'];
  skuPurchased: (skuId: string) => boolean;
  registerPurchasesChangedHandler: (
    callback: (
      purchaseState: NamiPurchasesState,
      purchases: NamiPurchase[],
      error: string,
    ) => void,
  ) => EmitterSubscription['remove'];
  registerRestorePurchasesHandler: (
    callback: (
      state: NamiRestorePurchasesState,
      newPurchases: NamiPurchase[],
      oldPurchases: NamiPurchase[],
    ) => void,
  ) => EmitterSubscription['remove'];
}

export const NamiPurchaseManager: INamiPurchaseManager = {
  emitter: new NativeEventEmitter(RNNamiPurchaseManager),
  ...NamiPurchaseManagerBridge,
  ...RNNamiPurchaseManager,
  registerPurchasesChangedHandler: (
    callback: (
      purchaseState: NamiPurchasesState,
      purchases: NamiPurchase[],
      error: string,
    ) => void,
  ) => {
    const subscription = NamiPurchaseManager.emitter.addListener(
      NamiPurchaseManagerEvents.PurchasesChanged,
      body => {
        let purchases = body.purchases;
        let purchaseState =
          body.purchaseState.toLowerCase() as NamiPurchasesState;
        let error = body.error;
        callback(purchaseState, purchases, error);
      },
    );
    RNNamiPurchaseManager.registerPurchasesChangedHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerRestorePurchasesHandler: (
    callback: (
      state: NamiRestorePurchasesState,
      newPurchases: NamiPurchase[],
      oldPurchases: NamiPurchase[],
    ) => void,
  ) => {
    if (Platform.OS === 'ios') {
      const subscription = NamiPurchaseManager.emitter.addListener(
        NamiPurchaseManagerEvents.RestorePurchasesStateChanged,
        body => {
          let state = body.state.toLowerCase() as NamiRestorePurchasesState;
          let newPurchases = body.newPurchases;
          let oldPurchases = body.oldPurchases;
          callback(state, newPurchases, oldPurchases);
        },
      );
      RNNamiPurchaseManager.registerRestorePurchasesHandler();
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  },
};
