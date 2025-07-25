import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    launch(label: string | null, withUrl: string | null, context: {
        productGroups?: string[];
        customAttributes?: {
            [key: string]: string;
        };
        customObject?: {
            [key: string]: unknown;
        };
    } | null, completion: (successAction: boolean, error: number | null) => void, paywallCompletion: (event: {
        campaignId?: string;
        campaignName?: string;
        campaignType?: string;
        campaignLabel?: string;
        campaignUrl?: string;
        paywallId?: string;
        paywallName?: string;
        segmentId?: string;
        externalSegmentId?: string;
        action: string;
        sku?: {
            id?: string;
            name?: string;
            skuId?: string;
            type?: string;
            promoId?: string;
            promoToken?: string;
        };
        purchaseError?: string;
        purchases?: Array<{
            sku?: {
                id: string;
                skuId: string;
                name: string;
                type: string;
            };
            skuId: string;
            transactionIdentifier?: string;
            purchaseToken?: string;
            expires?: number;
            purchaseInitiatedTimestamp: number;
            purchaseSource?: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
        }>;
        deeplinkUrl?: string;
        componentChange?: {
            id?: string;
            name?: string;
        };
        videoMetadata?: {
            id?: string;
            name?: string;
            url?: string;
            loopVideo?: boolean;
            muteByDefault?: boolean;
            autoplayVideo?: boolean;
            contentTimecode?: string;
            contentDuration?: string;
        };
        timeSpentOnPaywall?: number;
    }) => void): void;
    allCampaigns(): Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    isCampaignAvailable(source?: string): Promise<boolean>;
    refresh(): Promise<{
        id?: string;
        rule?: string;
        segment?: string;
        paywall?: string;
        type: string;
        value?: string;
    }[]>;
    registerAvailableCampaignsHandler(): void;
}
declare const _default: Spec;
export default _default;
