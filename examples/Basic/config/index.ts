import {NativeModules} from 'react-native';
import {getInitialConfig} from './getInitialConfig';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    case 'production':
      return {
        'appPlatformID-apple': 'APPLE_STG_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_STG_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': 'APPLE_PROD_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
  }
}
