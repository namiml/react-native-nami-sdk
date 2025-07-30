import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { NamiFlowManager, NamiCustomerManager } from 'react-native-nami-sdk';
import { logger } from 'react-native-logs';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { NavigationContainerRefWithCurrent } from '@react-navigation/native';
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
  navigationRef: NavigationContainerRefWithCurrent<any>,
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
          NamiFlowManager.pause();
          if (navigationRef?.current?.navigate) {
            navigationRef.current.navigate('SignIn');
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

        case 'push': {
          if (Platform.OS === 'ios') {
            PushNotificationIOS.requestPermissions().then(result => {
              const granted = !!(
                result.alert || result.authorizationStatus === 1
              );
              NamiCustomerManager.setCustomerAttribute(
                'pushAuthorized',
                granted ? 'true' : 'false',
              );
              if (granted) setCustomerAttributesFromHandoff(data);
              NamiFlowManager.resume();
            });
          } else if (Platform.OS === 'android') {
            try {
              const permission =
                'android.permission.POST_NOTIFICATIONS' as unknown as Permission;
              log.info('[NamiFlowManager] check notification permission');

              const status = await check(permission);
              if (status === RESULTS.GRANTED) {
                log.info('[NamiFlowManager] notification permission granted');
                NamiCustomerManager.setCustomerAttribute(
                  'pushAuthorized',
                  'true',
                );
                setCustomerAttributesFromHandoff(data);
                NamiFlowManager.resume();
              } else {
                log.info('[NamiFlowManager] notification request permission');
                const grantStatus = await request(permission);
                const granted = grantStatus === RESULTS.GRANTED;
                NamiCustomerManager.setCustomerAttribute(
                  'pushAuthorized',
                  granted ? 'true' : 'false',
                );
                if (granted) setCustomerAttributesFromHandoff(data);
                NamiFlowManager.resume();
              }
            } catch (err) {
              // Log the error and continue flow
              log.warn(
                '[NamiFlowManager] Error checking/requesting POST_NOTIFICATIONS permission:',
                err,
              );
              NamiFlowManager.resume();
            }
          } else {
            NamiFlowManager.resume();
          }
          break;
        }

        case 'location': {
          let permission;
          if (Platform.OS === 'ios') {
            permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
          } else if (Platform.OS === 'android') {
            permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
          }
          if (permission) {
            check(permission).then(status => {
              if (status === RESULTS.GRANTED) {
                NamiCustomerManager.setCustomerAttribute(
                  'locationAuthorized',
                  'true',
                );
                NamiFlowManager.resume();
              } else if (status === RESULTS.DENIED) {
                request(permission).then(grantStatus => {
                  NamiCustomerManager.setCustomerAttribute(
                    'locationAuthorized',
                    grantStatus === RESULTS.GRANTED ? 'true' : 'false',
                  );
                  NamiFlowManager.resume();
                });
              } else {
                NamiCustomerManager.setCustomerAttribute(
                  'locationAuthorized',
                  'false',
                );
                NamiFlowManager.resume();
              }
            });
          } else {
            NamiFlowManager.resume();
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
  }, []);
}
