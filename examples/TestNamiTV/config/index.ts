import { NativeModules } from 'react-native';
import { getInitialConfig } from './getInitialConfig';

export function getConfigObject() {
  const flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
