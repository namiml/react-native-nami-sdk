import { NamiPaywallManager } from 'react-native-nami-sdk';
import { handleDeepLink } from './deeplinking';
import { logger } from 'react-native-logs';

const log = logger.createLogger();

const eventSubscriptions: (() => void)[] = [];

export function registerNamiPaywallListeners() {
  console.log('[paywallHandlers] Registering global paywall event handlers...');

  eventSubscriptions.push(
    NamiPaywallManager.registerSignInHandler(async () => {
      log.debug('[paywallHandlers] Sign In requested - calling dismiss');
      await NamiPaywallManager.dismiss();
    }),

    NamiPaywallManager.registerCloseHandler(async () => {
      log.debug('[paywallHandlers] Close requested - calling dismiss');
      await NamiPaywallManager.dismiss();
    }),

    NamiPaywallManager.registerRestoreHandler(async () => {
      log.debug('[paywallHandlers] Restore requested - calling dismiss');
      await NamiPaywallManager.dismiss();
    }),

    NamiPaywallManager.registerDeeplinkActionHandler(async (url: string) => {
      log.debug('[paywallHandlers] Deeplink Action:', url);
      NamiPaywallManager.buySkuCancel();
      await NamiPaywallManager.dismiss();

      if (url) {
        handleDeepLink({ url });
      }
    }),
  );
}

export function removeNamiPaywallListeners() {
  eventSubscriptions.forEach(remove => remove());
  eventSubscriptions.length = 0;
}
