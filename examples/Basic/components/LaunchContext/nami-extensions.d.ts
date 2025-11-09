import { NamiCampaignManager as OriginalNamiCampaignManager } from 'react-native-nami-sdk';

declare module 'react-native-nami-sdk' {
  export interface NamiCampaignManager {
    /**
     * Gets the product groups associated with a campaign
     * @param campaignLabel The label of the campaign
     * @returns Promise that resolves to an array of product group strings
     */
    getProductGroups(campaignLabel: string): Promise<string[]>;
  }
}

// Extend the existing NamiCampaignManager if the method doesn't exist
if (!('getProductGroups' in OriginalNamiCampaignManager)) {
  // Fallback implementation that returns empty array if method is not available
  (OriginalNamiCampaignManager as any).getProductGroups = async (campaignLabel: string): Promise<string[]> => {
    console.warn('NamiCampaignManager.getProductGroups is not implemented, returning empty array');
    return [];
  };
}
