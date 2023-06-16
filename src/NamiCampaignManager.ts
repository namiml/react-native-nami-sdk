import { NativeModules, NativeEventEmitter } from 'react-native';
import {
  LaunchCampaignError,
  NamiCampaign,
  NamiPaywallAction,
  NamiPurchase,
} from './types';

export const { RNNamiCampaignManager } = NativeModules;

export enum NamiCampaignManagerEvents {
  ResultCampaign = 'ResultCampaign',
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
}

const searchString_Nami = 'NAMI_';

interface ICampaignManager {
  launchSubscription: any;
  allCampaigns: () => Promise<Array<NamiCampaign>>;
  isCampaignAvailable: (label?: string) => boolean;
  launch: (
    label?: string,
    //context?: PaywallLaunchContext,
    resultCallback?: (success: boolean, error?: LaunchCampaignError) => void,
    actionCallback?: (
      action: NamiPaywallAction,
      skuId?: string,
      purchaseError?: string,
      purchases?: NamiPurchase[],
      campaignId?: string,
      campaignLabel?: string,
      paywallId?: string,
    ) => void,
  ) => void;
  refresh: () => void;
  registerAvailableCampaignsHandler: (
    callback: (availableCampaigns: NamiCampaign[]) => void,
  ) => () => void;
}

export const NamiCampaignManager: ICampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, resultCallback, actionCallback) {
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
