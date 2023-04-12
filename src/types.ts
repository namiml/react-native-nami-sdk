export type NamiSKU = {
  name: string;
  skuId: string;
  // product : SKProduct?
  // type : NamiSKUType
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
