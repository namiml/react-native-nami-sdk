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
          ? '4a2f6dbf-e684-4d65-a4df-0488771c577d'
          : 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5';
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