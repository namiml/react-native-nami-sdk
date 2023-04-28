/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import {Nami} from 'react-native-nami-sdk';
import App from './App';
import {name as appName} from './app.json';
import {PurchasesContextProvider} from './hooks/usePurchases';
import {getConfigObject} from './config';

const configDict = getConfigObject();
console.log('configDict', configDict);
Nami.configure(configDict);

const Root = () => {
  return (
    <PurchasesContextProvider>
      <App />
    </PurchasesContextProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
