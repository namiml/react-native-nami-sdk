/**
/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {PurchasesContextProvider} from './hooks/usePurchases';

const Root = () => {
  return (
    <PurchasesContextProvider>
      <App />
    </PurchasesContextProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
