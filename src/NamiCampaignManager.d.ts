import {EmitterSubscription} from 'react-native';
import {NamiPurchase} from './NamiPurchaseManager';
import {NamiPaywallAction} from './NamiPaywallManager';

export const NamiCampaignManager: {
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable: (label?: string) => boolean;
  launch: (
    label?: string,
    withUrl?: string,
    context?: PaywallLaunchContext,
    resultCallback?: (success: boolean, error?: LaunchCampaignError) => void,
    actionCallback?: (
      campaignId: string,
      paywallId: string,
      action: NamiPaywallAction,
      campaignName?: string,
      campaignType?: string,
      campaignLabel?: string,
      campaignUrl?: string,
      paywallName?: string,
      segmentId?: string,
      externalSegmentId?: string,
      deeplinkUrl?: string,
      skuId?: string,
      purchaseError?: string,
      purchases?: NamiPurchase[],
    ) => void,
  ) => void;
  refresh: () => void;
  registerAvailableCampaignsHandler: (
    callback: (availableCampaigns: NamiCampaign[]) => void,
  ) => EmitterSubscription['remove'];
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
  DEFAULT = 'default',
  LABEL = 'label',
  UNKNOWN = 'unknown',
  URL = 'url',
}

export enum LaunchCampaignError {
  DEFAULT_CAMPAIGN_NOT_FOUND = 0,
  LABELED_CAMPAIGN_NOT_FOUND = 1,
  CAMPAIGN_DATA_NOT_FOUND = 2,
  PAYWALL_ALREADY_DISPLAYED = 3,
  SDK_NOT_INITIALIZED = 4,
}

export enum LaunchCampaignResultAction {
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

export type FailureResultObject = {
  error: string;
};

export type PaywallLaunchContext = {
  productGroups?: string[];
  customAttributes: Map<string, string>;
};
