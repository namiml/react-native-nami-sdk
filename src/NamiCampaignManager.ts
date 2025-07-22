import type { Spec } from '../specs/NativeNamiCampaignManager';
import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type {
  NamiPaywallEvent,
  PaywallLaunchContext,
  NamiCampaign,
} from './types';
import { NamiPaywallAction } from './types';

const RNNamiCampaignManager: Spec =
  TurboModuleRegistry.getEnforcing<Spec>('RNNamiCampaignManager') ??
  NativeModules.RNNamiCampaignManager;

export enum NamiCampaignManagerEvents {
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
  NamiPaywallEvent = 'NamiPaywallEvent',
}

const validPaywallActions = new Set(
  Object.values(NamiPaywallAction) as NamiPaywallAction[],
);

function mapToNamiPaywallAction(action: string): NamiPaywallAction {
  console.log('RNPaywall', action);
  return validPaywallActions.has(action as NamiPaywallAction)
    ? (action as NamiPaywallAction)
    : NamiPaywallAction.UNKNOWN;
}

const emitter = new NativeEventEmitter(NativeModules.RNNamiCampaignManager);

export const NamiCampaignManager = {
  emitter,

  launchSubscription: undefined as
    | ReturnType<NativeEventEmitter['addListener']>
    | undefined,

  launch(
    label: string | null,
    withUrl: string | null,
    context: PaywallLaunchContext | null,
    resultCallback?: (success: boolean, errorCode?: number | null) => void,
    actionCallback?: (event: any) => void,
  ): void {
    if (this.launchSubscription) {
      this.launchSubscription.remove();
    }

    this.launchSubscription = this.emitter.addListener(
      NamiCampaignManagerEvents.NamiPaywallEvent,
      (body: any) => {
        if (actionCallback) {
          const paywallEvent: NamiPaywallEvent = {
            action: mapToNamiPaywallAction(body.action),
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
      label,
      withUrl,
      context,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {}),
    );
  },

  allCampaigns: async () => {
    return await RNNamiCampaignManager.allCampaigns();
  },

  isCampaignAvailable: async (campaignName: string | null) => {
    return await RNNamiCampaignManager.isCampaignAvailable(
      campaignName ?? undefined,
    );
  },

  refresh: async () => {
    return await RNNamiCampaignManager.refresh();
  },

  registerAvailableCampaignsHandler: (
    callback: (campaigns: NamiCampaign[]) => void,
  ): (() => void) => {
    const sub = emitter.addListener(
      NamiCampaignManagerEvents.AvailableCampaignsChanged,
      callback,
    );
    RNNamiCampaignManager.registerAvailableCampaignsHandler?.();
    return () => sub.remove();
  },
};
