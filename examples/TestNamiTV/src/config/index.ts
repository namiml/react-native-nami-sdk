import { NativeModules } from 'react-native';
import { getInitialConfig } from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    // case 'staging':
    //   return {
    //     'appPlatformID-apple': 'APPLE_STAGE_APP_PLATFORM_ID',
    //     'appPlatformID-android': 'UNUSED',
    //     logLevel: 'DEBUG',
    //     namiCommands: ['useStagingAPI'],
    //     initialConfig: getInitialConfig(),
    //   };
    case 'staging':
      // https://app-staging.namiml.com/integrations/
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'stagingAmazon':
      return {
        'appPlatformID-apple': 'UNUSED',
        'appPlatformID-android': 'AMAZON_STAGE_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'stagingGoogle':
      return {
        'appPlatformID-apple': 'UNUSED',
        'appPlatformID-android': 'GOOGLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'productionAmazon':
      return {
        'appPlatformID-apple': 'UNUSED',
        'appPlatformID-android': 'AMAZON_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    case 'productionGoogle':
      return {
        'appPlatformID-apple': 'UNUSED',
        'appPlatformID-android': 'GOOGLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': 'APPLE_PROD_APP_PLATFORM_ID',
        'appPlatformID-android': 'GOOGLE_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
