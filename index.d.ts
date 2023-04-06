import { EmitterSubscription } from "react-native";

export const NamiCampaignManager: {
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable: (label?: string) => boolean;
  launch: (
    label?: string,
    callback?: (success: boolean, error?: LaunchCampaignError) => void
  ) => void;
  refresh: () => void;
  registerAvailableCampaignsHandler: (
    callback: (availableCampaigns: NamiCampaign[]) => void
  ) => EmitterSubscription["remove"];
};

export type NamiCampaign = {
  id: string;
  rule: string;
  segment: string;
  paywall: string;
  type: NamiCampaignRuleType;
  value?: string;
};

export enum NamiCampaignRuleType {
  DEFAULT = "default",
  LABEL = "label",
  UNKNOWN = "unknown",
}

export enum LaunchCampaignError {
  DEFAULT_CAMPAIGN_NOT_FOUND = 0,
  LABELED_CAMPAIGN_NOT_FOUND = 1,
  CAMPAIGN_DATA_NOT_FOUND = 2,
  PAYWALL_ALREADY_DISPLAYED = 3,
  SDK_NOT_INITIALIZED = 4,
}

export const NamiCustomerManager: {
  setCustomerAttribute: (key: string, value: string) => void;
  getCustomerAttribute: (key: string) => Promise<string | undefined>;
  clearCustomerAttribute: (key: string) => void;
  clearAllCustomerAttributes: () => void;
  journeyState: () => Promise<CustomerJourneyState | undefined>;
  isLoggedIn: () => Promise<boolean>;
  loggedInId: () => Promise<string | undefined>;
  deviceId: () => Promise<string>;
  login: (
    customerId: string,
    callback?: (success: boolean, error?: number) => void
  ) => void;
  logout: (callback?: (success: boolean, error?: number) => void) => void;
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void
  ) => EmitterSubscription["remove"];
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number
    ) => void
  ) => EmitterSubscription["remove"];
};

export type CustomerJourneyState = {
  formerSubscriber: boolean;
  inGracePeriod: boolean;
  inTrialPeriod: boolean;
  inIntroOfferPeriod: boolean;
  isCancelled: boolean;
  inPause: boolean;
  inAccountHold: boolean;
};

export type AccountStateAction = "login" | "logout";

export const NamiEntitlementManager: {
  active: () => Promise<Array<NamiEntitlement>>;
  isEntitlementActive: (label?: string) => boolean;
  refresh: () => void;
  registerActiveEntitlementsHandler: (
    callback: (activeEntitlements: NamiEntitlement[]) => void
  ) => EmitterSubscription["remove"];
};

export type NamiEntitlement = {
  //"activePurchases"
  desc: string;
  name: string;
  namiId: string;
  //"purchasedSkus"
  referenceId: string;
  //"relatedSkus"
};

export const NamiPurchaseManager: {
  anySkuPurchased: (skuIds: string[]) => boolean;
  buySku: (
    sku: any,
    callback?: (
      purchases: any,
      state: string,
      error?: LaunchCampaignError
    ) => void
  ) => void;
  consumePurchasedSku: (skuId: string) => void;
  presentCodeRedemptionSheet: () => void;
  // restorePurchases: () => void;
  skuPurchased: (skuId: string) => boolean;
  // buySkuComplete: () => void;
  registerPurchasesChangedHandler: (
    callback: (responseHandler: any) => void
  ) => EmitterSubscription["remove"];
  registerRestorePurchasesHandler: (
    callback: (changeHandler: any) => void
  ) => EmitterSubscription["remove"];
  registerBuySkuHandler: (
    callback: (sku: any) => void
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
