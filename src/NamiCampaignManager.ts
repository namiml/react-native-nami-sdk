import type { Spec } from '../specs/NativeNamiCampaignManager';
import { TurboModuleRegistry, NativeModules, NativeEventEmitter } from 'react-native';
import type { NamiPaywallEvent, PaywallLaunchContext } from './types';
import { NamiPaywallAction } from './types';

const RNNamiCampaignManager: Spec = TurboModuleRegistry.getEnforcing<Spec>('RNNamiCampaignManager') ??
  NativeModules.RNNamiCampaignManager;

export enum NamiCampaignManagerEvents {
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
  NamiPaywallEvent = 'NamiPaywallEvent',
}

const validPaywallActions = new Set(Object.values(NamiPaywallAction) as NamiPaywallAction[]);

function mapToNamiPaywallAction(action: string): NamiPaywallAction {
  return validPaywallActions.has(action as NamiPaywallAction)
    ? (action as NamiPaywallAction)
    : NamiPaywallAction.UNKNOWN;
}

const emitter = new NativeEventEmitter(NativeModules.RNNamiCampaignManager);

export const NamiCampaignManager = {
  emitter,

  launchSubscription: undefined as ReturnType<NativeEventEmitter['addListener']> | undefined,

  launch(label, withUrl, context, resultCallback, actionCallback) {
    if (this.launchSubscription) {
      this.launchSubscription.remove();
    }

    this.launchSubscription = this.emitter.addListener(
      NamiCampaignManagerEvents.NamiPaywallEvent,
      body => {
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


  allCampaigns: async () => {
    return await RNNamiCampaignManager.allCampaigns();
  },

  isCampaignAvailable: async (campaignName: string | null) => {
    return await RNNamiCampaignManager.isCampaignAvailable(campaignName ?? undefined);
  },

  refresh: async () => {
    return await RNNamiCampaignManager.refresh();
  },

registerAvailableCampaignsHandler: (callback: (campaigns: any[]) => void): () => void => {
  const sub = emitter.addListener(NamiCampaignManagerEvents.AvailableCampaignsChanged, callback);
  RNNamiCampaignManager.registerAvailableCampaignsHandler?.();
  return () => sub.remove();
},
};
