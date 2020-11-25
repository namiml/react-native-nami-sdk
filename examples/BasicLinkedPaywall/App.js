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

  const onSessionConnect = (event) => {
    console.log('ExampleApp: purchases changed: ', event);
    if (event.purchaseState === 'PURCHASED') {
      console.log('Detected PURCHASED state, updating purchases');
      setPurchases(event.purchases);
    }
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

      
    let PurchasedSubscription = eventEmitter.addListener(
      'PurchasesChanged',
      onSessionConnect,
    );


      if (eventEmitter._subscriber._subscriptionsForType.AppPaywallActivate == null) {
        let PaywallShouldRaiseSubscription = eventEmitter.addListener( 'AppPaywallActivate', onPaywallShouldRaise);
      }

    var configDict = {
      'appPlatformID-google': 'a95cef52-35e0-4794-8755-577492c2d5d1',
      'appPlatformID-apple': '54635e21-87ed-4ed6-9119-9abb493bc9b0',
      logLevel: 'DEBUG',
      developmentMode: false,
      bypassStore: false,
    };

    NativeModules.NamiBridge.configure(configDict);

    NativeModules.NamiPaywallManagerBridge.canRaisePaywall((result) => {
      console.log('ExampleApp: Nami canRaisePaywall ', result);
    });
    return () => {
      PurchasedSubscription.remove();
      PaywallShouldRaiseSubscription.remove();
    };
  }, []);

  return <AppNavigation />;
};

export default App;
