/**
 * @format
 */
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { View } from 'react-native';
import { AppRegistry } from 'react-native';
import { Nami, NamiPaywallManager } from 'react-native-nami-sdk';
import App from './App';
import { name as appName } from './app.json';
import { getConfigObject } from './config';
import amazonSideloadProducts from './nami_amazon_product_details.json';

const configDict = getConfigObject();
console.log('configDict', configDict);

export const getAmazonProducts = () => {
  return JSON.stringify(amazonSideloadProducts);
};

const Root = () => {
  const [isConfigurationComplete, setIsConfigurationComplete] = useState();
  useEffect(() => {
    async function configureNami() {
      const result = await Nami.configure(configDict);
      if (result.success) {
        setIsConfigurationComplete(true);

        if (Platform.constants.Manufacturer === 'Amazon') {
          NamiPaywallManager.setProductDetails(getAmazonProducts(), true);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return () => {};
    }
    configureNami();
  }, []);

  return isConfigurationComplete ? <App /> : <View />;
};

AppRegistry.registerComponent(appName, () => Root);
