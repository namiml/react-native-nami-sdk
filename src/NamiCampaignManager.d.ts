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