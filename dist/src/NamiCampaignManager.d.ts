import { NativeEventEmitter } from 'react-native';
import type { NamiPaywallEvent, PaywallLaunchContext } from './types';
export declare enum NamiCampaignManagerEvents {
    AvailableCampaignsChanged = "AvailableCampaignsChanged"
}
export declare const NamiCampaignManager: {
    emitter: NativeEventEmitter;
    launch: (label: string | null, withUrl: string | null, context: PaywallLaunchContext | null, completion: (success: boolean, errorCode?: number | null) => void, paywallCompletion: (event: NamiPaywallEvent) => void) => void;
    allCampaigns: () => Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    isCampaignAvailable: (campaignName: string | null) => Promise<boolean>;
    refresh: () => Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    registerAvailableCampaignsHandler: (callback: (campaigns: any[]) => void) => () => void;
};
