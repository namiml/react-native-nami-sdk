import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import {
  LaunchCampaignError,
  NamiCampaign,
  NamiPaywallAction,
  NamiPurchase,
  PaywallLaunchContext,
} from './types';

export const { RNNamiCampaignManager } = NativeModules;

export enum NamiCampaignManagerEvents {
  ResultCampaign = 'ResultCampaign',
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
}

const searchString_Nami = 'NAMI_';

interface ICampaignManager {
  launchSubscription: EmitterSubscription | undefined;
  emitter: NativeEventEmitter;
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable(campaignSource: string | null): Promise<boolean>;
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
}

export const NamiCampaignManager: ICampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, withUrl, context, resultCallback, actionCallback) {
    if (this.launchSubscription) {
      this.launchSubscription.remove();
    }

    this.launchSubscription = this.emitter.addListener(
      NamiCampaignManagerEvents.ResultCampaign,
      body => {
        const {
          action: rawAction,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId,
        } = body;

        const action = rawAction.startsWith(searchString_Nami)
          ? rawAction.substring(5, rawAction.length)
          : rawAction;

        actionCallback?.(
          action,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId,
        );
      },
    );
    RNNamiCampaignManager.launch(
      label ?? null,
      withUrl ?? null,
      context ?? null,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {}),
    );
  },

  isCampaignAvailable: label => {
    return RNNamiCampaignManager.isCampaignAvailable(label ?? null);
  },

  registerAvailableCampaignsHandler(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Expected callback to be a function.');
    }
    const subscription = this.emitter.addListener(
      NamiCampaignManagerEvents.AvailableCampaignsChanged,
      callback,
    );

    RNNamiCampaignManager.registerAvailableCampaignsHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
};
