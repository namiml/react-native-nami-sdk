import { useEffect } from 'react';
import { Linking } from 'react-native';
import { NamiFlowManager, NamiCustomerManager, NamiOverlayControl } from 'react-native-nami-sdk';
import { logger } from 'react-native-logs';
import { SignInOverlay } from '../components/SignInOverlay';

import type { Product, Subscription } from 'react-native-iap';
import type { NamiSKU } from 'react-native-nami-sdk';
import {
  startSkuPurchase,
} from '../services/purchase';

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
export function useNamiFlowListener(
  setProducts: (products: Product[]) => void,
  setSubscriptions: (subs: Subscription[]) => void,
  setNamiSku: (sku: NamiSKU) => void,
) {
  useEffect(() => {
    log.debug('[NamiFlowManager] Registering step handoff listener');

    const handleHandoff = async (tag: string, data: any) => {
      log.info('[NamiFlowManager] Handoff received:', tag, data);
      console.info('[NamiFlowManager] Handoff received:', tag, data);

      switch (tag) {

        case 'signin': {
          log.info('[NamiFlowManager] Handling signin handoff with overlay');
          // Register the SignInOverlay component
          NamiOverlayControl.setCustomOverlayComponent(SignInOverlay);

          // Set up result listener
          const unsubscribe = NamiOverlayControl.onOverlayResult((result: any) => {
            NamiCustomerManager.setCustomerAttribute('signInFromOnboardingComplete', 'true');
            log.info('[NamiFlowManager] SignIn overlay result:', result);
            unsubscribe();
            NamiFlowManager.resume();
          });

          // Present overlay
          try {
            await NamiOverlayControl.presentOverlay();
            log.info('[NamiFlowManager] SignIn overlay presented successfully');
          } catch (error) {
            log.error('[NamiFlowManager] Failed to present signin overlay:', error);
            unsubscribe();
            NamiFlowManager.resume();
          }
          break;
        }

        case 'buysku': {
          const rawSku = data?.sku;
          if (
            rawSku &&
            typeof rawSku.skuId === 'string' &&
            typeof rawSku.type === 'string'
          ) {
            const normalizedSku: NamiSKU = {
              skuId: rawSku.skuId,
              type: rawSku.type,
              name: rawSku.name ?? '',
              id: rawSku.id ?? '',
              promoId: rawSku.promoId,
              promoToken: rawSku.promoOfferToken,
              promoOffer: rawSku.computedSignature ?? null,
            };

            log.debug('[NamiFlowManager] normalized sku:', normalizedSku);

            await startSkuPurchase(
              normalizedSku,
              setProducts,
              setSubscriptions,
              setNamiSku
            );
          } else {
            log.warn('[NamiFlowManager] Invalid or missing SKU in handoff:', rawSku);
          }
          break;
        }


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
  }, [setNamiSku, setProducts, setSubscriptions]);
}
