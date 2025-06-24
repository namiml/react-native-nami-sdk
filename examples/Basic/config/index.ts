import { NativeModules, Platform } from 'react-native';
import { getInitialConfig } from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);

  let appPlatformID;

  switch (flavor) {
    case 'staging':
      appPlatformID =
        Platform.OS === 'ios'
          ? 'APPLE_STG_APP_PLATFORM_ID'
          : 'ANDROID_STG_APP_PLATFORM_ID';
      return {
        appPlatformID,
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI', 'useNamiWindow'],
        initialConfig: getInitialConfig(),
      };
    default:
      appPlatformID =
        Platform.OS === 'ios'
          ? 'APPLE_PROD_APP_PLATFORM_ID'
          : 'ANDROID_PROD_APP_PLATFORM_ID';
      return {
        appPlatformID,
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
