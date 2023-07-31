import { EmitterSubscription } from "react-native";
import { NamiPurchase } from "./NamiPurchaseManager";
import { NamiPaywallAction } from "./NamiPaywallManager";
import { NamiSKU } from "./types";
import { NamiPaywallAction, NamiPurchase } from "./types";

export const NamiCampaignManager: {
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable(campaignSource: string | null): Promise<boolean>;
  launch: (
    label?: string,
    withUrl?: string,
    context?: PaywallLaunchContext,
    resultCallback?: (success: boolean, error?: LaunchCampaignError) => void,
    actionCallback?: (
      action: NamiPaywallAction,
      campaignId: string,
      paywallId: string,
      campaignName?: string,
      campaignType?: string,
      campaignLabel?: string,
      campaignUrl?: string,
      paywallName?: string,
      segmentId?: string,
      externalSegmentId?: string,
      deeplinkUrl?: string,
      skuId?: string,
      componentChangeId?: string,
      componentChangeName?: string,
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
  type: NamiCampaignRule;
  value?: string | null;
};

export enum NamiCampaignRule {
  DEFAULT = "default",
  LABEL = "label",
  UNKNOWN = "unknown",
  URL = "url",
}

export enum LaunchCampaignError {
  DEFAULT_CAMPAIGN_NOT_FOUND = 0,
  LABELED_CAMPAIGN_NOT_FOUND = 1,
  CAMPAIGN_DATA_NOT_FOUND = 2,
  PAYWALL_ALREADY_DISPLAYED = 3,
  SDK_NOT_INITIALIZED = 4,
}

export enum LaunchCampaignResultAction {
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
}

export type FailureResultObject = {
  error: string;
};

export type PaywallLaunchContext = {
  productGroups?: string[];
  customAttributes?: {
    [key: string]: string;
  };
};

export type NamiPaywallEvent = {
  action: NamiPaywallAction;
  campaignId?: string;
  campaignName?: string;
  campaignType?: string;
  campaignLabel?: string;
  campaignUrl?: string;
  paywallId?: string;
  paywallName?: string;
  componentChange?: NamiPaywallComponentChange;
  segmentId?: string;
  externalSegmentId?: string;
  deeplinkUrl?: string;
  sku?: NamiSKU;
  purchaseError?: string;
  purchases?: NamiPurchase[];
};

export type NamiPaywallComponentChange = {
  id?: string;
  name?: string;
};
