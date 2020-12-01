import React, {useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './containers/HomeScreen';
import AboutScreen from './containers/AboutScreen';
import {usePurchasesContext} from './hooks/usePurchases';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  About: {screen: AboutScreen},
});

const AppNavigation = createAppContainer(MainNavigator);

const App = () => {
  const {setPurchases} = usePurchasesContext();
  const {NamiEmitter} = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);

  const onSessionConnect = (event) => {
    console.log('ExampleApp: Purchases changed: ', event);
    if (event.purchaseState == 'PURCHASED') {
      console.log('Detected purchase, setting SKU IDs');
      setPurchases(event.purchases);
    }
  };

  const onPaywallShouldRaise = (event) => {
    // Add code to present your custom paywall here
    console.log('ExampleApp: Data for paywall raise ', event);
  };

  const onSignInActivated = (event) => {
    // Add code to present UI for sign-in
    console.log('ExampleApp: Data for sign-in ', event);
  };

  useEffect(() => {
    console.log('ExampleApp: Nami Bridge is');
    console.log(NativeModules.NamiBridge);

    if (
      eventEmitter._subscriber._subscriptionsForType.PurchasesChanged == null
    ) {
      eventEmitter.addListener('PurchasesChanged', onSessionConnect);
    }

    if (
      eventEmitter._subscriber._subscriptionsForType.AppPaywallActivate == null
    ) {
      eventEmitter.addListener('AppPaywallActivate', onPaywallShouldRaise);
    }

    if (eventEmitter._subscriber._subscriptionsForType.SignInActivate == null) {
      eventEmitter.addListener('SignInActivate', onSignInActivated);
    }

    console.log(
      'ExampleApp: HavePaywallManager',
      NativeModules.NamiPaywallManagerBridge,
    );

    let configDict = {
      'appPlatformID-apple': '002e2c49-7f66-4d22-a05c-1dc9f2b7f2af',
      'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
      logLevel: 'DEBUG',
      developmentMode: true,
      bypassStore: true,
    };

    NativeModules.NamiBridge.configure(configDict);
  }, []);

  return <AppNavigation />;
};

export default App;
