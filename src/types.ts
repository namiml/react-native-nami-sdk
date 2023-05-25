export type NamiSKU = {
  name: string;
  skuId: string;
  appleProduct?: AppleProduct;
  googleProduct?: GoogleProduct;
  amazonProduct?: AmazonProduct;
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

export type AppleProduct = {
  localizedDescription: string;
  localizedMultipliedPrice: string;
  localizedPrice: string;
  localizedTitle: string;
  price: string;
  priceCurrency: string;
  priceLanguage: string;
};

export type GoogleProduct = {
};

export type AmazonProduct = {
};