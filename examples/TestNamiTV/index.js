/**
 * @format
 */
import {AppRegistry} from 'react-native';
import {Nami, NamiLanguageCodes} from 'react-native-nami-sdk';
import App from './App';

let configDict = {
  'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
  'appPlatformID-android': 'YOUR-GOOGLE-APP-PLATFORM_ID',
  logLevel: 'DEBUG',
  namiLanguageCode: NamiLanguageCodes,
  namiCommands: ['useStagingAPI']
};

Nami.configure(configDict);

AppRegistry.registerComponent('TestNamiTV', () => App);
