import { Platform } from 'react-native';
// import NativeBuildFlavor from '../specs/NativeBuildFlavor';

import initAppleStageConfig from '../nami_initial_config_apple_stg.json';
import initAndroidStageConfig from '../nami_initial_config_android_stg.json';
import initAppleProductionConfig from '../nami_initial_config_apple_prod.json';
import initAndroidProductionConfig from '../nami_initial_config_android_prod.json';

export const getInitialConfig = () => {
  // const flavor = NativeBuildFlavor.getBuildFlavor();
  const flavor = "staging";

  switch (Platform.OS) {
    case 'android':
      return JSON.stringify(
        flavor === 'production'
          ? initAndroidProductionConfig
          : initAndroidStageConfig,
      );
    case 'ios':
      return JSON.stringify(
        flavor === 'production'
          ? initAppleProductionConfig
          : initAppleStageConfig,
      );
    default:
      null;
  }
};
