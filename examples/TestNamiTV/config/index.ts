import { NativeModules } from 'react-native';
import { getInitialConfig } from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID': 'APPLE_STAGE_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'production':
      return {
        'appPlatformID': 'APPLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    case 'stagingAmazon':
      return {
        'appPlatformID': 'AMAZON_STAGE_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'stagingPlay':
      return {
        'appPlatformID': 'GOOGLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    case 'productionAmazon':
      return {
        'appPlatformID': 'AMAZON_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    case 'productionPlay':
      return {
        'appPlatformID': 'GOOGLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID': 'UNKNOWN_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
