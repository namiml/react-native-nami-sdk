import type { Spec } from '../specs/NativeNamiCampaignManager';
import { TurboModuleRegistry, NativeModules, NativeEventEmitter } from 'react-native';
import type { NamiPaywallEvent, PaywallLaunchContext } from './types';

const RNNamiCampaignManager: Spec = TurboModuleRegistry.getEnforcing<Spec>('RNNamiCampaignManager') ??
  NativeModules.RNNamiCampaignManager;

export enum NamiCampaignManagerEvents {
  AvailableCampaignsChanged = 'AvailableCampaignsChanged',
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
    RNNamiCampaignManager.launch(label, withUrl, context, completion, paywallCompletion);
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
