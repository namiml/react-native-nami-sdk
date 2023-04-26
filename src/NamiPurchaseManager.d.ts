import { EmitterSubscription } from "react-native";

export const NamiPurchaseManager: {
  anySkuPurchased: (skuIds: string[]) => boolean;
  buySku: (
    sku: any,
    callback?: (purchases: any, state: string, error?: any) => void
  ) => void;
  consumePurchasedSku: (skuId: string) => void;
  clearBypassStorePurchases: () => void;
  presentCodeRedemptionSheet: () => void;
  // restorePurchases: () => void;
  skuPurchased: (skuId: string) => boolean;
  registerPurchasesChangedHandler: (
    callback: (responseHandler: any) => void
  ) => EmitterSubscription["remove"];
  registerRestorePurchasesHandler: (
    callback: (changeHandler: any) => void
  ) => EmitterSubscription["remove"];
};

export type NamiPurchase = {
  // sku: any,
  expires?: Date;
  // entitlementsGranted: [any],
  transactionIdentifier?: string;
  // transaction : any,
  skuId: string;
  purchaseInitiatedTimestamp: Date;
};

export enum NamiPurchaseState {
  PURCHASED = "PURCHASED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLEDd",
  PENDING = "PENDING",
  UNKNOWN = "UNKNOWN",
}
