import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import {
  LaunchCampaignError,
  NamiCampaign,
  NamiPaywallActionHandler,
  NamiPaywallEvent,
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
    actionCallback?: NamiPaywallActionHandler,
  ) => void;
  refresh: () => Promise<Array<NamiCampaign>>;
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
        body.action = body.action.startsWith(searchString_Nami)
          ? body.action.substring(5, body.action.length)
          : body.action;

        if (actionCallback) {
          const paywallEvent: NamiPaywallEvent = {
            action: body.action,
            campaignId: body.campaignId,
            campaignName: body.campaignName,
            campaignType: body.campaignType,
            campaignLabel: body.campaignLabel,
            campaignUrl: body.campaignUrl,
            paywallId: body.paywallId,
            paywallName: body.paywallName,
            componentChange: body.componentChange,
            segmentId: body.segmentId,
            externalSegmentId: body.externalSegmentId,
            deeplinkUrl: body.deeplinkUrl,
            videoMetadata: body.videoMetadata,
            timeSpentOnPaywall: body.timeSpentOnPaywall,
            sku: body.sku,
            purchaseError: body.purchaseError,
            purchases: body.purchases,
          };
          actionCallback(paywallEvent);
        }
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

  isCampaignAvailable: campaignSource => {
    return RNNamiCampaignManager.isCampaignAvailable(campaignSource ?? null);
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
