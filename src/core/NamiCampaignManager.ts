import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

import type {
  LaunchCampaignError,
  NamiCampaign,
  NamiPaywallAction,
  NamiPurchase,
  PaywallLaunchContext,
} from '../types';

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
      (body) => {
        body.action = body.action.startsWith(searchString_Nami)
          ? body.action.substring(5, body.action.length)
          : body.action;

        const {
          action,
          campaignId,
          paywallId,
          campaignName,
          campaignType,
          campaignLabel,
          campaignUrl,
          paywallName,
          segmentId,
          externalSegmentId,
          deeplinkUrl,
          skuId,
          componentChangeId,
          componentChangeName,
          purchaseError,
          purchases,
        } = body;
        if (actionCallback) {
          actionCallback(
            action,
            campaignId,
            paywallId,
            campaignName,
            campaignType,
            campaignLabel,
            campaignUrl,
            paywallName,
            segmentId,
            externalSegmentId,
            deeplinkUrl,
            skuId,
            componentChangeId,
            componentChangeName,
            purchaseError,
            purchases
          );
        }
      }
    );
    RNNamiCampaignManager.launch(
      label ?? null,
      withUrl ?? null,
      context ?? null,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {})
    );
  },

  isCampaignAvailable: (campaignSource) => {
    return RNNamiCampaignManager.isCampaignAvailable(campaignSource ?? null);
  },

  registerAvailableCampaignsHandler(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Expected callback to be a function.');
    }
    const subscription = this.emitter.addListener(
      NamiCampaignManagerEvents.AvailableCampaignsChanged,
      callback
    );

    RNNamiCampaignManager.registerAvailableCampaignsHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
};
