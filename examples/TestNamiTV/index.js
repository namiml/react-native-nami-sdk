/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import {NativeModules} from 'react-native';
import {Nami} from 'react-native-nami-sdk';
import App from './App';

let flavor = NativeModules.RNConfig.FLAVOR ?? 'production';
let appPlatformIDApple = 'e1e51d49-5bda-41b2-9367-8408bb374b07';
let appPlatformIDAndroid = '9cdda53d-fcb1-4d5b-b8b7-575437b6fe34';
if (Platform.OS === 'android' && Platform.constants.Manufacturer === 'Amazon') {
  appPlatformIDAndroid = '76a40e56-f4df-4bcd-a1d0-615408caaec1';
};
let namiCommands = [''];

if (flavor === 'staging') {
  appPlatformIDApple = '4a2f6dbf-e684-4d65-a4df-0488771c577d';
  appPlatformIDAndroid = 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5';
  if (
    Platform.OS === 'android' &&
    Platform.constants.Manufacturer === 'Amazon'
  ) {
    appPlatformIDAndroid = 'd5256425-e827-4ae4-970e-66d027dc1108';
  }
  namiCommands = ['useStagingAPI'];
};

let configDict = {
  'appPlatformID-apple': appPlatformIDApple,
  'appPlatformID-android': appPlatformIDAndroid,
  logLevel: 'DEBUG',
  namiCommands: namiCommands,
};

Nami.configure(configDict);

AppRegistry.registerComponent('TestNamiTV', () => App);
