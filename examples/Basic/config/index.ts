import {NativeModules} from 'react-native';
import {getInitialConfig} from './getInitialConfig';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;

  console.log('flavor', flavor);
  switch (flavor) {
    case 'production':
      return {
        'appPlatformID-apple': 'e1e51d49-5bda-41b2-9367-8408bb374b07',
        'appPlatformID-android': '9cdda53d-fcb1-4d5b-b8b7-575437b6fe34',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
    default:
      // "111c1877-d660-4ad8-90f3-0b553e19e570"
      // 4a2f6dbf-e684-4d65-a4df-0488771c577d
      // '3d062066-9d3c-430e-935d-855e2c56dd8e'
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
        initialConfig: getInitialConfig(),
      };
  }
}
