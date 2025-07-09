import { NativeEventEmitter } from 'react-native';
import { NamiPurchase, NamiPurchasesState, NamiRestorePurchasesState } from './types';
export declare enum NamiPurchaseManagerEvents {
    PurchasesChanged = "PurchasesChanged",
    RestorePurchasesStateChanged = "RestorePurchasesStateChanged"
}
export declare const NamiPurchaseManager: {
    emitter: NativeEventEmitter;
    allPurchases: () => Promise<NamiPurchase[]>;
    skuPurchased: (skuId: string) => Promise<boolean>;
    anySkuPurchased: (skuIds: string[]) => Promise<boolean>;
    consumePurchasedSku: (skuId: string) => void;
    presentCodeRedemptionSheet: () => void;
    restorePurchases: () => void;
    registerPurchasesChangedHandler: (callback: (state: NamiPurchasesState, purchases: NamiPurchase[], error: string) => void) => (() => void);
    registerRestorePurchasesHandler: (callback: (state: NamiRestorePurchasesState, newPurchases: NamiPurchase[], oldPurchases: NamiPurchase[]) => void) => (() => void);
};
