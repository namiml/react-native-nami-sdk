import {NativeModules, Platform} from 'react-native';

export function getConfigObject() {
  let flavor = NativeModules.RNConfig.FLAVOR;
  console.log('flavor', flavor);
  switch (flavor) {
    case 'production':
      let appPlatformIDAndroidProd = '9cdda53d-fcb1-4d5b-b8b7-575437b6fe34';
      if (
        Platform.OS === 'android' &&
        Platform.constants.Manufacturer === 'Amazon'
      ) {
        appPlatformIDAndroidProd = '76a40e56-f4df-4bcd-a1d0-615408caaec1';
      }
      return {
        'appPlatformID-apple': 'e1e51d49-5bda-41b2-9367-8408bb374b07',
        'appPlatformID-android': appPlatformIDAndroidProd,
        logLevel: 'DEBUG',
      };
    default:
      let appPlatformIDAndroidStg = 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5';
      if (
        Platform.OS === 'android' &&
        Platform.constants.Manufacturer === 'Amazon'
      ) {
        appPlatformIDAndroidStg = 'd5256425-e827-4ae4-970e-66d027dc1108';
      }
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': appPlatformIDAndroidStg,
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI'],
      };
  }
}
