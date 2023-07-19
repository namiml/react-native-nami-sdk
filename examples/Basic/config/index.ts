import {NativeModules} from 'react-native';
import {getInitialConfig} from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID-apple': 'APPLE_STG_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_STG_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI', 'useNamiWindow'],
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': 'e1e51d49-5bda-41b2-9367-8408bb374b07',
        'appPlatformID-android': 'ANDROID_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
