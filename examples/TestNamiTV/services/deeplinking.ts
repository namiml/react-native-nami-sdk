import { NamiCampaignManager, NamiPaywallEvent } from 'react-native-nami-sdk';

interface HandleDeepLinkParams {
  url: string;
}

export const prefixes = ['testnami://'];

export async function handleDeepLink(params: HandleDeepLinkParams) {
  const { url } = params;
  console.log('Received deep link:', url);

  const isCampaignAvailable = await NamiCampaignManager.isCampaignAvailable(
    url ?? '',
  );
  if (isCampaignAvailable && url) {
    console.log('Calling verified deeplink action using launch:', url);
    try {
      NamiCampaignManager.launch(
        undefined,
        url,
        undefined,
        (event: NamiPaywallEvent) => {
          console.log('event', event);
        },
      );
    } catch (error) {
      console.log('Error launching campaign: ', error);
    }
  }
}
