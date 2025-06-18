import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { NamiFlowManager, NamiCustomerManager } from 'react-native-nami-sdk';
import { logger } from 'react-native-logs';
import { check, request, PERMISSIONS, RESULTS, Permission } from 'react-native-permissions';
import PushNotificationIOS from '@react-native-community/push-notification-ios';


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
        case 'push': {
          if (Platform.OS === 'ios') {
            PushNotificationIOS.requestPermissions().then(result => {
              const granted = !!(result.alert || result.authorizationStatus === 1);
              NamiCustomerManager.setCustomerAttribute('pushAuthorized', granted ? 'true' : 'false');
              if (granted) setCustomerAttributesFromHandoff(data);
              NamiFlowManager.resume();
            });
          } else if (Platform.OS === 'android') {
            NamiCustomerManager.setCustomerAttribute('pushAuthorized', 'true');
            NamiFlowManager.resume();
            // try {
            //   const permission = 'android.permission.POST_NOTIFICATIONS' as unknown as Permission;
            //   log.info('[NamiFlowManager] check notification permission');

            //   const status = await check(permission);
            //   if (status === RESULTS.GRANTED) {
            //     log.info('[NamiFlowManager] notification permission granted');
            //     NamiCustomerManager.setCustomerAttribute('pushAuthorized', 'true');
            //     setCustomerAttributesFromHandoff(data);
            //     NamiFlowManager.resume();
            //   } else {
            //     log.info('[NamiFlowManager] notification request permission');
            //     const grantStatus = await request(permission);
            //     const granted = grantStatus === RESULTS.GRANTED;
            //     NamiCustomerManager.setCustomerAttribute('pushAuthorized', granted ? 'true' : 'false');
            //     if (granted) setCustomerAttributesFromHandoff(data);
            //     NamiFlowManager.resume();
            //   }
            // } catch (err) {
            //   // Log the error and continue flow
            //   log.warn('[NamiFlowManager] Error checking/requesting POST_NOTIFICATIONS permission:', err);
            //   NamiFlowManager.resume();
            // }
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
                NamiCustomerManager.setCustomerAttribute('locationAuthorized', 'true');
                NamiFlowManager.resume();
              } else if (status === RESULTS.DENIED) {
                request(permission).then(grantStatus => {
                  NamiCustomerManager.setCustomerAttribute(
                    'locationAuthorized',
                    grantStatus === RESULTS.GRANTED ? 'true' : 'false'
                  );
                  NamiFlowManager.resume();
                });
              } else {
                NamiCustomerManager.setCustomerAttribute('locationAuthorized', 'false');
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
                log.info('[NamiFlowManager] Failed to open deeplink:', url, err);
              })
              .finally(() => {
                NamiFlowManager.resume();
              });
          } else {
            log.info('[NamiFlowManager] No deeplink URL provided in handoff data:', data);
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
