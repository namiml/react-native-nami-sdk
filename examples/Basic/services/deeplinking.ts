import {NamiCampaignManager} from 'react-native-nami-sdk';

export const prefixes = ['testnami://'];

export async function handleDeepLink(event) {
  const {url} = event;
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
        skuId,
        purchaseError,
        purchases,
        campaignId,
        campaignLabel,
        paywallId,
      ) => {
        console.log('action', action);
        console.log('skuId', skuId);
        console.log('purchaseError', purchaseError);
        console.log('purchases', purchases);
        console.log('campaignId', campaignId);
        console.log('campaignLabel', campaignLabel);
        console.log('paywallId', paywallId);
      },
    );
  }
}
