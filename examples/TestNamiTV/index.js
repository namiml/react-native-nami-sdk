/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import {NativeModules} from 'react-native';
import {Nami} from 'react-native-nami-sdk';
import App from './App';

import namiInitialConfigAndroidStg from './nami_initial_config_android_stg.json';
import namiInitialConfigAppleStg from './nami_initial_config_apple_stg.json';

let namiInitialConfigStg = '';
let namiInitialConfigProd = '';
let flavor = NativeModules.RNConfig.FLAVOR ?? 'production';

var amazonDevice = false;
if (Platform.OS === 'android' && Platform.constants.Manufacturer === 'Amazon') {
  amazonDevice = true;
}

if (Platform.OS === 'ios' || Platform.isTVOS) {
  namiInitialConfigStg = JSON.stringify(namiInitialConfigAndroidStg);
}
if (Platform.OS === 'android' && amazonDevice === false) {
  namiInitialConfigStg = JSON.stringify(namiInitialConfigAndroidStg);
}

let configDict = {};

if (flavor === 'staging') {
  configDict = {
    'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
    'appPlatformID-android':
      amazonDevice === true
        ? 'd5256425-e827-4ae4-970e-66d027dc1108'
        : 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
    logLevel: 'DEBUG',
    namiCommands: ['useStagingAPI'],
  };

  if (namiInitialConfigStg !== '') {
    configDict.initialConfig = namiInitialConfigStg;
  }
} else {
  configDict = {
    'appPlatformID-apple': 'e1e51d49-5bda-41b2-9367-8408bb374b07',
    'appPlatformID-android':
      amazonDevice === true
        ? '76a40e56-f4df-4bcd-a1d0-615408caaec1'
        : '9cdda53d-fcb1-4d5b-b8b7-575437b6fe34',
    logLevel: 'WARN',
  };

  if (namiInitialConfigProd !== '') {
    configDict.initialConfig = namiInitialConfigProd;
  }
}

Nami.configure(configDict);

AppRegistry.registerComponent('TestNamiTV', () => App);
