/**
 * @format
 */
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { AppRegistry } from 'react-native';
import { Nami } from 'react-native-nami-sdk';
import App from './App';
import { name as appName } from './app.json';
import { getConfigObject } from './config';

import { initConnection, PurchaseError } from 'react-native-iap';

const configDict = getConfigObject();
console.log('Nami SDK Config:', configDict);

async function initStoreConnection() {
  try {
    await initConnection();
  } catch (error) {
    if (error instanceof PurchaseError) {
      console.log(
        '[Store Init Error]',
        `[${error.code}]: ${error.message}`,
        error,
      );
    } else {
      console.log('[Store Init Error]', error);
    }
  }
}

const Root = () => {
  const [isConfigurationComplete, setIsConfigurationComplete] = useState(false);
  const [sdkError, setSdkError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function configureNami() {
      const sdkVersion = Nami.sdkVersion();
      console.log('Nami SDK Version: ', sdkVersion);

      try {
        const alreadyConfigured = await Nami.sdkConfigured();

        if (alreadyConfigured) {
          console.log('Nami SDK already configured. Skipping setup.');
          setIsConfigurationComplete(true);
        } else {
          const success = await Nami.configure(configDict);

          if (success) {
            console.log('Nami configured successfully');
            setIsConfigurationComplete(true);
          } else {
            console.warn('Nami configuration returned success: false');
            setSdkError('Nami SDK configuration returned false');
          }
        }
      } catch (e) {
        console.error('Nami configuration error:', e);
        setSdkError('Exception during Nami SDK configuration');
      } finally {
        setIsLoading(false);
        await initStoreConnection();
      }
    }
    configureNami();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Loading spinner or message */}
        <Text>Starting Nami SDK...</Text>
      </View>
    );
  }

  if (sdkError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Nami SDK Error
        </Text>
        <Text>{sdkError}</Text>
        <Text style={{ marginTop: 12 }}>
          Check logs or the configuration object your are passing into
          Nami.configure.
        </Text>
      </View>
    );
  }

  return isConfigurationComplete ? <App /> : <View />;
};

AppRegistry.registerComponent(appName, () => Root);
