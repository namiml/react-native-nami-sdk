import React, {useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './containers/HomeScreen';
import AboutScreen from './containers/AboutScreen';
import {useOpenContext} from './hooks/useOpen';
import {usePurchasesContext} from './hooks/usePurchases';
import {useDataContext} from './hooks/useData';

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  About: {screen: AboutScreen},
});

const AppNavigation = createAppContainer(MainNavigator);

const App = () => {
  const {open, setOpen} = useOpenContext();
  const {setPurchases} = usePurchasesContext();
  const {setData} = useDataContext();
  const {NamiEmitter} = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);

  const onPurchasesChanged = (event) => {
    console.log('ExampleApp: purchases changed: ', event);
    if (event.purchaseState === 'PURCHASED') {
      console.log('Detected PURCHASED state, updating purchases');
      setPurchases(event.purchases);
    }
  };

  const onEntitlementsChanged = (event) => {
    // Add code to check for entitlements activating or deactivating features
    console.log(
      'ExampleApp: Data for entitlements changed ',
      event.activeEntitlements,
    );
  };

  const onPaywallShouldRaise = (event) => {
    // Add code to present your custom paywall here
    console.log('ExampleApp: Data for paywall raise ', event);
    setData(event);
    setOpen(!open);
  };

  useEffect(() => {
    console.log('ExampleApp: Nami Bridge is');
    console.log(NativeModules.NamiBridge, 'NamiBridge');
    console.log(
      NativeModules.NamiPaywallManagerBridge,
      'NamiPaywallManagerBridge',
    );
    console.log(NativeModules.NamiMLManagerBridge, 'NamiMLManagerBridge');

    if (
      eventEmitter._subscriber._subscriptionsForType.PurchasesChanged == null
    ) {
      eventEmitter.addListener('PurchasesChanged', onPurchasesChanged);
    }

    if (
      eventEmitter._subscriber._subscriptionsForType.AppPaywallActivate == null
    ) {
      eventEmitter.addListener('AppPaywallActivate', onPaywallShouldRaise);
    }

    if (
      eventEmitter._subscriber._subscriptionsForType.EntitlementsChanged == null
    ) {
      eventEmitter.addListener('EntitlementsChanged', onEntitlementsChanged);
    }

    var configDict = {
      'appPlatformID-google': 'a95cef52-35e0-4794-8755-577492c2d5d1',
      'appPlatformID-apple': '54635e21-87ed-4ed6-9119-9abb493bc9b0',
      logLevel: 'DEBUG',
      developmentMode: false,
      bypassStore: false,
    };

    NativeModules.NamiBridge.configure(configDict);
    NativeModules.NamiPurchaseManagerBridge.clearBypassStorePurchases();
    NativeModules.NamiPaywallManagerBridge.canRaisePaywall((result) => {
      console.log('ExampleApp: Nami canRaisePaywall ', result);
    });
  }, []);

  return <AppNavigation />;
};

export default App;
