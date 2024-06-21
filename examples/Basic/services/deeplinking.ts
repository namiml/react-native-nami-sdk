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
    NamiCampaignManager.launch(
      undefined,
      url,
      undefined,
      (success, error) => {
        console.log(success, error);
      },
      (event: NamiPaywallEvent) => {
        console.log('event', event);
      },
    );
  }
}
