import { NativeEventEmitter } from 'react-native';
import type { PaywallLaunchContext, NamiCampaign } from './types';
export declare enum NamiCampaignManagerEvents {
    AvailableCampaignsChanged = "AvailableCampaignsChanged",
    NamiPaywallEvent = "NamiPaywallEvent"
}
export declare const NamiCampaignManager: {
    emitter: NativeEventEmitter;
    launchSubscription: ReturnType<NativeEventEmitter["addListener"]> | undefined;
    launch(label: string | null, withUrl: string | null, context: PaywallLaunchContext | null, resultCallback?: (success: boolean, errorCode?: number | null) => void, actionCallback?: (event: any) => void): void;
    allCampaigns: () => Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    isCampaignAvailable: (campaignName: string | null) => Promise<boolean>;
    isFlow: (label?: string | null, withUrl?: string | null) => Promise<boolean>;
    refresh: () => Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    registerAvailableCampaignsHandler: (callback: (campaigns: NamiCampaign[]) => void) => (() => void);
    getProductGroups: (label?: string | null, withUrl?: string | null) => Promise<string[]>;
};
