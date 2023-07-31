import { NamiCampaignManager } from 'react-native-nami-sdk';

export const prefixes = ['testnami://'];

export async function handleDeepLink(event) {
  const { url } = event;
  console.log('Received deep link:', url);

  const isCampaignAvailable = await NamiCampaignManager.isCampaignAvailable(
    url ?? '',
  );
  if (isCampaignAvailable && url) {
    console.log('Calling verified deeplink action using launch:', url);
    NamiCampaignManager.launch(
      undefined,
      url,
      undefined,
      (success, error) => {
        console.log(success, error);
      },
      (
        action,
        campaignId,
        paywallId,
        campaignLabel,
        campaignName,
        campaignType,
        campaignUrl,
        segmentId,
        externalSegmentId,
        paywallName,
        deeplinkUrl,
        skuId,
        purchaseError,
        purchases,
      ) => {
        console.log('action', action);
        console.log('campaignId', campaignId);
        console.log('paywallId', paywallId);
        console.log('campaignLabel', campaignLabel);
        console.log('campaignName', campaignName);
        console.log('campaignType', campaignType);
        console.log('campaignUrl', campaignUrl);
        console.log('paywallName', paywallName);
        console.log('segmentId', segmentId);
        console.log('externalSegmentId', externalSegmentId);
        console.log('deeplinkUrl', deeplinkUrl);
        console.log('skuId', skuId);
        console.log('purchaseError', purchaseError);
        console.log('purchases', purchases);
      },
    );
  }
}
