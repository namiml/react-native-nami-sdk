import { NativeEventEmitter } from 'react-native';
import { EmitterSubscription } from 'react-native';
import { NamiPurchase, NamiPurchasesState, NamiRestorePurchasesState } from './types';
export declare const NamiPurchaseManagerBridge: any, RNNamiPurchaseManager: any;
export declare enum NamiPurchaseManagerEvents {
    PurchasesChanged = "PurchasesChanged",
    RestorePurchasesStateChanged = "RestorePurchasesStateChanged"
}
export interface INamiPurchaseManager {
    emitter: NativeEventEmitter;
    allPurchases: () => NamiPurchase[];
    anySkuPurchased: (skuIds: string[]) => boolean;
    consumePurchasedSku: (skuId: string) => void;
    presentCodeRedemptionSheet: () => void;
    restorePurchases: (callback: (purchaseState: NamiPurchasesState, purchases: NamiPurchase[], error: string) => void) => EmitterSubscription['remove'];
    skuPurchased: (skuId: string) => boolean;
    registerPurchasesChangedHandler: (callback: (purchaseState: NamiPurchasesState, purchases: NamiPurchase[], error: string) => void) => EmitterSubscription['remove'];
    registerRestorePurchasesHandler: (callback: (state: NamiRestorePurchasesState, newPurchases: NamiPurchase[], oldPurchases: NamiPurchase[]) => void) => EmitterSubscription['remove'];
}
export declare const NamiPurchaseManager: INamiPurchaseManager;
