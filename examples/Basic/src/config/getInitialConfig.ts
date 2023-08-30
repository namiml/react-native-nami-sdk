import { NativeModules, Platform } from 'react-native';

import initAndroidProductionConfig from '../../nami_initial_config_android_prod.json';
import initAndroidStageConfig from '../../nami_initial_config_android_stg.json';
import initAppleProductionConfig from '../../nami_initial_config_apple_prod.json';
import initAppleStageConfig from '../../nami_initial_config_apple_stg.json';

export const getInitialConfig = () => {
  const flavor = NativeModules.RNConfig.FLAVOR;

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
