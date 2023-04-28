import { EmitterSubscription } from "react-native";
import { NamiSKU } from "./types";
import { NamiEntitlement } from "./NamiEntitlementManager";

export const NamiPurchaseManager: {
  allPurchases: () => NamiPurchase[];
  anySkuPurchased: (skuIds: string[]) => boolean;
  consumePurchasedSku: (skuId: string) => void;
  clearBypassStorePurchases: () => void;
  presentCodeRedemptionSheet: () => void;
  restorePurchases: () => void;
  skuPurchased: (skuId: string) => boolean;
  registerPurchasesChangedHandler: (
    callback: (
      purchaseState: NamiPurchasesState,
      purchases: NamiPurchase[],
      error: string
    ) => void
  ) => EmitterSubscription["remove"];
  registerRestorePurchasesHandler: (
    callback: (
      state: NamiRestorePurchasesState,
      newPurchases: NamiPurchase[],
      oldPurchases: NamiPurchase[]
    ) => void
  ) => EmitterSubscription["remove"];
};

export type NamiPurchase = {
  sku?: NamiSKU;
  skuId: string;
  transactionIdentifier?: string;
  expires?: Date;
  purchaseInitiatedTimestamp: Date;
};

export enum NamiPurchaseState {
  PURCHASED = "PURCHASED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLEDd",
  PENDING = "PENDING",
  UNKNOWN = "UNKNOWN",
}

export type NamiRestorePurchasesState = "started" | "finished" | "error";

export type NamiPurchasesState =
  | "pending"
  | "purchased"
  | "consumed"
  | "resubscribed"
  | "unsubscribed"
  | "deferred"
  | "failed"
  | "cancelled"
  | "unknown";
