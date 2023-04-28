import {NativeModules} from 'react-native';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);
  switch (flavor) {
    case 'production':
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
        logLevel: 'DEBUG',
        developmentMode: false,
        bypassStore: false,
      };
    default:
      // "111c1877-d660-4ad8-90f3-0b553e19e570"
      // 4a2f6dbf-e684-4d65-a4df-0488771c577d
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
        logLevel: 'DEBUG',
        developmentMode: false,
        bypassStore: false,
        namiCommands: ['useStagingAPI'],
      };
  }
}
