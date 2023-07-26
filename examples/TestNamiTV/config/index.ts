import {NativeModules} from 'react-native';
import {getInitialConfig} from './getInitialConfig';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID-apple': 'APPLE_STAGE_APP_PLATFORM_ID',
        'appPlatformID-android': 'UNUSED',
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
