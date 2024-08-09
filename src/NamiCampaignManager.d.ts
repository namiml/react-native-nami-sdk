import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { NamiCampaign, NamiPaywallActionHandler, PaywallLaunchContext } from './types';
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
    launch: (label?: string, withUrl?: string, context?: PaywallLaunchContext, actionCallback?: NamiPaywallActionHandler) => Promise<void>;
    refresh: () => void;
    registerAvailableCampaignsHandler: (callback: (availableCampaigns: NamiCampaign[]) => void) => EmitterSubscription['remove'];
}
export declare const NamiCampaignManager: ICampaignManager;
export {};
