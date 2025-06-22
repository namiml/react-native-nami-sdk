import type { Spec } from '../specs/NativeNamiCampaignManager';
import { TurboModuleRegistry, NativeModules, NativeEventEmitter } from 'react-native';
import type { NamiPaywallEvent, PaywallLaunchContext } from './types';
import { NamiPaywallAction } from './types';

const RNNamiCampaignManager: Spec = TurboModuleRegistry.getEnforcing<Spec>('RNNamiCampaignManager') ??
  NativeModules.RNNamiCampaignManager;

export enum NamiCampaignManagerEvents {
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
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

  launch: (
    label: string | null,
    withUrl: string | null,
    context: PaywallLaunchContext | null,
    completion: (success: boolean, errorCode?: number | null) => void,
    paywallCompletion: (event: NamiPaywallEvent) => void
  ) => {
    const wrappedPaywallCompletion = (event: any) => {
      const action = mapToNamiPaywallAction(event.action);
      const typedEvent: NamiPaywallEvent = {
        ...event,
        action,
      };
      paywallCompletion(typedEvent);
    };

    RNNamiCampaignManager.launch(label, withUrl, context, completion, wrappedPaywallCompletion);
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
