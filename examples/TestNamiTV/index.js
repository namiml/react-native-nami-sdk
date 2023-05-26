/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import {Nami, NamiLanguageCodes} from 'react-native-nami-sdk';
import App from './App';

let appPlatformIDAndroid = 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5';

if (Platform.OS === 'android' && Platform.constants.Manufacturer === 'Amazon') {
  appPlatformIDAndroid = 'd5256425-e827-4ae4-970e-66d027dc1108';
}

let configDict = {
  'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
  'appPlatformID-android': appPlatformIDAndroid,
  logLevel: 'DEBUG',
  namiCommands: ['useStagingAPI'],
};

Nami.configure(configDict);

AppRegistry.registerComponent('TestNamiTV', () => App);