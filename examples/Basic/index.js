/**
 * @format
 */
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AppRegistry } from 'react-native';
import { Nami, NamiManager } from 'react-native-nami-sdk';
import App from './App';
import { name as appName } from './app.json';
import { getConfigObject } from './config';

const configDict = getConfigObject();
console.log('configDict', configDict);


const Root = () => {
  const [isConfigurationComplete, setIsConfigurationComplete] = useState();

  const checkSdkConfigured = async () => {
      const configured = await NamiManager.sdkConfigured();
      console.log('NamiSDK: configured', configured);
  };

  useEffect(() => {

    checkSdkConfigured();

    Nami.configure(configDict, (resultObject) => {
      setIsConfigurationComplete(true);
      checkSdkConfigured();

    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};


  }, []);

  return isConfigurationComplete ? <App /> : <View />;
};

AppRegistry.registerComponent(appName, () => Root);
