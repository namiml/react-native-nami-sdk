import { EmitterSubscription } from "react-native";
import { NamiPurchase } from "./NamiPurchaseManager";
import { NamiPaywallAction } from "./NamiPaywallManager";

export const NamiCampaignManager: {
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable: (label?: string) => boolean;
  launch: (
    label?: string,
    context?: PaywallLaunchContext,
    resultCallback?: (success: boolean, error?: LaunchCampaignError) => void,
    actionCallback?: (
      action: NamiPaywallAction,
      skuId?: string,
      purchaseError?: string,
      purchases?: NamiPurchase[],
      campaignId?: string,
      campaignLabel?: string,
      paywallId?: string
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

export enum LaunchCampaignResultAction {
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
}

export type FailureResultObject = {
  error: string;
};

export type PaywallLaunchContext = {
  productGroups?: string[];
  customAttributes: Map<string, string>;
};
