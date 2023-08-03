import { NativeModules } from 'react-native';
import { getInitialConfig } from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID-apple': 'APPLE_STAGE_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_STAGE_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI', 'useNamiWindow'],
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': 'APPLE_PROD_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
