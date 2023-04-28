import { EmitterSubscription } from "react-native";
import { NamiPurchase } from "./NamiPurchaseManager";

export const NamiCampaignManager: {
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable: (label?: string) => boolean;
  launch: (
    label?: string,
    actionCallback?: (
      action?: string, // android only
      sku?: string, // android only
      purchaseError?: string, // android only
      purchases?: string, // android only
      success?: boolean, // ios only
      error?: LaunchCampaignError // ios only
    ) => void,
    resultCallback?: (
      action: LaunchCampaignResultAction,
      skuId?: string,
      purchaseError?: string,
      purchases?: NamiPurchase[]
    ) => void
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
  value?: string | null;
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

export enum LaunchCampaignAction {
  NAMI_BUY_SKU = "NAMI_BUY_SKU",
  NAMI_SELECT_SKU = "NAMI_SELECT_SKU",
  NAMI_RESTORE_PURCHASES = "NAMI_RESTORE_PURCHASES",
  NAMI_SIGN_IN = "NAMI_SIGN_IN",
  NAMI_CLOSE_PAYWALL = "NAMI_CLOSE_PAYWALL",
  NAMI_PURCHASE_SELECTED_SKU = "NAMI_PURCHASE_SELECTED_SKU",
  NAMI_PURCHASE_SUCCESS = "NAMI_PURCHASE_SUCCESS",
  NAMI_PURCHASE_FAILED = "NAMI_PURCHASE_FAILED",
  NAMI_PURCHASE_CANCELLED = "NAMI_PURCHASE_CANCELLED",
  NAMI_PURCHASE_PENDING = "NAMI_PURCHASE_PENDING",
  NAMI_PURCHASE_UNKNOWN = "NAMI_PURCHASE_UNKNOWN",
  NAMI_PURCHASE_DEFERRED = "NAMI_PURCHASE_DEFERRED",
}

export enum LaunchCampaignResultAction {
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
}

export type FailureResultObject = {
  error: string;
};
