import { NamiPaywallManager } from 'react-native-nami-sdk';
import { handleDeepLink } from './deeplinking';
import { logger } from 'react-native-logs';

const log = logger.createLogger();

const eventSubscriptions: (() => void)[] = [];

export function registerNamiPaywallListeners() {
  eventSubscriptions.push(
    NamiPaywallManager.registerSignInHandler(() => {
      log.debug('[paywallHandlers] Sign In requested');
    }),

    NamiPaywallManager.registerCloseHandler(() => {
      log.debug('[paywallHandlers] Close requested');
    }),

    NamiPaywallManager.registerRestoreHandler(() => {
      log.debug('[paywallHandlers] Restore requested');
    }),

    NamiPaywallManager.registerDeeplinkActionHandler((url: string) => {
      log.debug('[paywallHandlers] Deeplink Action:', url);
      if (url) {
        handleDeepLink({ url });
      }
    })
  );
}

export function removeNamiPaywallListeners() {
  eventSubscriptions.forEach((remove) => remove());
  eventSubscriptions.length = 0;
}
