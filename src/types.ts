export type NamiSKU = {
  name: string;
  skuId: string;
  product?: SKProduct;
  type: NamiSKUType;
};

export enum NamiPurchaseState {
  PENDING = "pending",
  PURCHASED = "purchased",
  CONSUMED = "consumed",
  RESUBSCRIBED = "resubscribed",
  UNSUBSCRIBED = "unsubscribed",
  DEFERRED = "deferred",
  FAILED = "failed",
  CANCELLED = "cancelled",
  UNKNOWN = "unknown",
}

export enum NamiRestorePurchasesState {
  STARTED = "started",
  FINISHED = "finished",
  ERROR = "error",
}

export type NamiSKUType = "unknown" | "one_time_purchase" | "subscription";

export type SKProduct = {
  localizedDescription: string;
  localizedMultipliedPrice: string;
  localizedPrice: string;
  localizedTitle: string;
  price: string;
  priceCurrency: string;
  priceLanguage: string;
};
