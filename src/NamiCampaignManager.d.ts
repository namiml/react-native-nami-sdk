import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { LaunchCampaignError, NamiCampaign, NamiPaywallActionHandler, PaywallLaunchContext } from './types';
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
    launch: (label?: string, withUrl?: string, context?: PaywallLaunchContext, resultCallback?: (success: boolean, error?: LaunchCampaignError) => void, actionCallback?: NamiPaywallActionHandler) => void;
    refresh: () => Promise<Array<NamiCampaign>>;
    registerAvailableCampaignsHandler: (callback: (availableCampaigns: NamiCampaign[]) => void) => EmitterSubscription['remove'];
}
export declare const NamiCampaignManager: ICampaignManager;
export {};
