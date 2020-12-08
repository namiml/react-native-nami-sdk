/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {OpenContextProvider} from './hooks/useOpen';
import {PurchasesContextProvider} from './hooks/usePurchases';
import {DataContextProvider} from './hooks/useData';

const Root = () => {
  return (
    <OpenContextProvider>
      <PurchasesContextProvider>
        <DataContextProvider>
          <App />
        </DataContextProvider>
      </PurchasesContextProvider>
    </OpenContextProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
