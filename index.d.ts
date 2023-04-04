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
  ) => void;
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
  ) => void;
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
