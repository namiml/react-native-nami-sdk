import {NativeModules, Platform} from 'react-native';

import initAppleStageConfig from '../nami_initial_config_apple_stg.json';
import initAndroidStageConfig from '../nami_initial_config-android_stg.json';
import initAppleProductionConfig from '../nami_initial_config_apple_prod.json';
import initAndroidProductionConfig from '../nami_initial_config-android_prod.json';

export const getInitialConfig = () => {
  let flavor = NativeModules.RNConfig.FLAVOR;

  switch (Platform.OS) {
    case 'android':
      return JSON.stringify(
        flavor === 'production'
          ? initAndroidProductionConfig
          : initAndroidStageConfig,
      );
    case 'ios':
      return JSON.stringify(
        flavor !== 'production'
          ? initAppleProductionConfig
          : initAppleStageConfig,
      );
    default:
      null;
  }
};
