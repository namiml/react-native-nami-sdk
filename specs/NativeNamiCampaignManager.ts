import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  launch(
    label: string | null,
    withUrl: string | null,
    context: {
      productGroups?: string[];
      customAttributes?: { [key: string]: string };
      customObject?: { [key: string]: unknown };
    } | null,
    completion: (successAction: boolean, error: number | null) => void,
    paywallCompletion: (event: {
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
        promoOffer?: { [key: string]: string } | null;
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
        expires?: number; // timestamp (ms)
        purchaseInitiatedTimestamp: number; // timestamp (ms)
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
    }) => void,
  ): void;

  allCampaigns(): Promise<
    {
      id?: string;
      rule?: string;
      segment?: string;
      paywall?: string;
      type: string;
      value?: string;
    }[]
  >;

  isCampaignAvailable(source?: string): Promise<boolean>;

  refresh(): Promise<
    {
      id?: string;
      rule?: string;
      segment?: string;
      paywall?: string;
      type: string;
      value?: string;
    }[]
  >;

  registerAvailableCampaignsHandler(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiCampaignManager');
