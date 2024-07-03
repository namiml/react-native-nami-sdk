import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { LaunchCampaignError, NamiCampaign, NamiPaywallAction, NamiPurchase, PaywallLaunchContext } from './types';
export declare const RNNamiCampaignManager: any;
export declare enum NamiCampaignManagerEvents {
    ResultCampaign = "ResultCampaign",
    AvailableCampaignsChanged = "AvailableCampaignsChanged"
}
interface ICampaignManager {
    launchSubscription: EmitterSubscription | undefined;
    emitter: NativeEventEmitter;
    allCampaigns: () => Promise<Array<NamiCampaign>>;
    isCampaignAvailable(campaignSource: string | null): Promise<boolean>;
    launch: (label?: string, withUrl?: string, context?: PaywallLaunchContext, resultCallback?: (success: boolean, error?: LaunchCampaignError) => void, actionCallback?: (action: NamiPaywallAction, campaignId: string, paywallId: string, campaignName?: string, campaignType?: string, campaignLabel?: string, campaignUrl?: string, paywallName?: string, segmentId?: string, externalSegmentId?: string, deeplinkUrl?: string, skuId?: string, componentChangeId?: string, componentChangeName?: string, purchaseError?: string, purchases?: NamiPurchase[]) => void) => void;
    refresh: () => Promise<Array<NamiCampaign>>;
    registerAvailableCampaignsHandler: (callback: (availableCampaigns: NamiCampaign[]) => void) => EmitterSubscription['remove'];
}
export declare const NamiCampaignManager: ICampaignManager;
export {};
