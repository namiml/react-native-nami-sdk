import { useEffect } from 'react';
import { Linking } from 'react-native';
import { NamiFlowManager, NamiCustomerManager } from 'react-native-nami-sdk';
import { logger } from 'react-native-logs';

const log = logger.createLogger({ severity: 'debug' });
let eventHandlerRegistered = false;

// Helper: set attributes from handoffData if it's an object
function setCustomerAttributesFromHandoff(data: any) {
  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      NamiCustomerManager?.setCustomerAttribute?.(key, String(value));
    });
  }
}

export function useNamiFlowListener() {
  useEffect(() => {
    log.debug('[NamiFlowManager] Registering step handoff listener');

    const handleHandoff = async (tag: string, data: any) => {
      log.info('[NamiFlowManager] Handoff received:', tag, data);
      console.info('[NamiFlowManager] Handoff received:', tag, data);

      switch (tag) {
        case 'deeplink': {
          log.info('[NamiFlowManager] Handling deeplink handoff', data);
          let url = null;
          if (data && typeof data === 'object') {
            url = data.url || null;
          }
          if (url) {
            Linking.openURL(url)
              .catch(err => {
                log.info(
                  '[NamiFlowManager] Failed to open deeplink:',
                  url,
                  err,
                );
              })
              .finally(() => {
                NamiFlowManager.resume();
              });
          } else {
            log.info(
              '[NamiFlowManager] No deeplink URL provided in handoff data:',
              data,
            );
            NamiFlowManager.resume();
          }
          break;
        }

        case 'complete': {
          setCustomerAttributesFromHandoff(data);
          NamiFlowManager.resume();
          break;
        }

        default:
          log.info('[NamiFlowManager] Unhandled Nami Flow handoff', tag);
          NamiFlowManager.resume();
      }
    };

    const unsubscribe = NamiFlowManager.registerStepHandoff(handleHandoff);

    if (!eventHandlerRegistered) {
      NamiFlowManager.registerEventHandler(payload => {
        log.info('[NamiFlowManager] event received:', payload);
      });
      eventHandlerRegistered = true;
    }

    return () => {
      log.debug('[NamiFlowManager] Removing step handoff listener');
      unsubscribe?.();
    };
  }, []);
}
