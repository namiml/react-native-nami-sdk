import {NativeModules} from 'react-native';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);
  switch (flavor) {
    case 'production':
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': '9cdda53d-fcb1-4d5b-b8b7-575437b6fe34',
        logLevel: 'DEBUG',
      };
    default:
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
      };
  }
}