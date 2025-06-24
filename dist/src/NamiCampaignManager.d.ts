import { NativeEventEmitter } from 'react-native';
export declare enum NamiCampaignManagerEvents {
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
  NamiPaywallEvent = 'NamiPaywallEvent',
}
export declare const NamiCampaignManager: {
  emitter: NativeEventEmitter;
  launchSubscription: ReturnType<NativeEventEmitter['addListener']> | undefined;
  launch(
    label: any,
    withUrl: any,
    context: any,
    resultCallback: any,
    actionCallback: any,
  ): void;
  allCampaigns: () => Promise<
    {
      id?: string;
      rule?: string;
      segment?: string;
      paywall?: string;
      type: string;
      value?: string;
    }[]
  >;
  isCampaignAvailable: (campaignName: string | null) => Promise<boolean>;
  refresh: () => Promise<
    {
      id?: string;
      rule?: string;
      segment?: string;
      paywall?: string;
      type: string;
      value?: string;
    }[]
  >;
  registerAvailableCampaignsHandler: (
    callback: (campaigns: any[]) => void,
  ) => () => void;
};
