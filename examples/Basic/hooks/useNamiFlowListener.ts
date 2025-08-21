import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { NamiFlowManager, NamiCustomerManager, NamiOverlayControl } from 'react-native-nami-sdk';
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

async function requestPermissionWithOverlay(
  permissionType: 'push' | 'location',
  permissionRequest: () => Promise<any>,
  data?: any
): Promise<void> {
  try {
    await NamiOverlayControl.presentOverlay();
    const off = NamiOverlayControl.onOverlayReady(async () => {
      try {
        const result = await permissionRequest();
        let granted = false;

        if (permissionType === 'push') {
          granted = Platform.OS === 'ios'
            ? !!(result.alert || result.authorizationStatus === 1)
            : result === RESULTS.GRANTED;
        } else {
          granted = result === RESULTS.GRANTED;
        }

        // Centralized attribute setting
        NamiCustomerManager.setCustomerAttribute(
          permissionType === 'push' ? 'pushAuthorized' : 'locationAuthorized',
          granted ? 'true' : 'false'
        );

        // Set handoff data if granted
        if (granted && data) setCustomerAttributesFromHandoff(data);

        await NamiOverlayControl.finishOverlay({ granted, status: result });

        // Centralized flow resume
        NamiFlowManager.resume();
      } catch (error) {
        console.error(`[NamiFlowManager] Error in overlay ${permissionType}:`, error);
        await NamiOverlayControl.finishOverlay({ granted: false, error: error.message });
        NamiFlowManager.resume();
      } finally {
        off();
      }
    });
  } catch (error) {
    console.warn(`[NamiFlowManager] Overlay failed for ${permissionType}, using fallback:`, error);
    // Fallback with centralized handling
    const result = await permissionRequest();
    const granted = permissionType === 'push'
      ? (Platform.OS === 'ios' ? !!(result.alert || result.authorizationStatus === 1) : result === RESULTS.GRANTED)
      : result === RESULTS.GRANTED;

    NamiCustomerManager.setCustomerAttribute(
      permissionType === 'push' ? 'pushAuthorized' : 'locationAuthorized',
      granted ? 'true' : 'false'
    );
    if (granted && data) setCustomerAttributesFromHandoff(data);
    NamiFlowManager.resume();
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
            await requestPermissionWithOverlay('push', () =>
              PushNotificationIOS.requestPermissions(), data
            );
          } else if (Platform.OS === 'android') {
            const permission = 'android.permission.POST_NOTIFICATIONS' as unknown as Permission;
            const status = await check(permission);
            if (status === RESULTS.GRANTED) {
              await requestPermissionWithOverlay('push', () => Promise.resolve(RESULTS.GRANTED), data);
            } else {
              await requestPermissionWithOverlay('push', () => request(permission), data);
            }
          } else {
            log.warn('[NamiFlowManager] Push notifications not supported on this platform');
            NamiFlowManager.resume();
          }
          break;
        }

        case 'location': {
          const permission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

          if (permission) {
            const status = await check(permission);
            if (status === RESULTS.GRANTED) {
              await requestPermissionWithOverlay('location', () => Promise.resolve(RESULTS.GRANTED), data);
            } else if (status === RESULTS.DENIED) {
              await requestPermissionWithOverlay('location', () => request(permission), data);
            } else {
              await requestPermissionWithOverlay('location', () => Promise.resolve(RESULTS.BLOCKED), data);
            }
          } else {
            log.warn('[NamiFlowManager] Location permissions not supported on this platform');
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
  }, [navigationRef, setNamiSku, setProducts, setSubscriptions]);
}
