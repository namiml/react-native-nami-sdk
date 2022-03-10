import React, {useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
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
  const {NamiAnalyticsEmitter} = NativeModules;
  const analyticsEmitter = new NativeEventEmitter(NamiAnalyticsEmitter);

  const onPurchasesChanged = (event) => {
    console.log('ExampleApp: Purchases changed: ', event);
    if (event.purchaseState == 'PURCHASED') {
      console.log('Detected purchase, setting SKU IDs');
      setPurchases(event.purchases);
    }
  };

  const addAnalyticsEvent = async (analyticsItems, actionType) => {
    let googleData = {};
    switch (actionType) {
      case 'paywall_raise':
        if (analyticsItems) {
          if (
            analyticsItems.paywallSKUs &&
            analyticsItems.paywallSKUs.length
          ) {
            let skus = analyticsItems.paywallSKUs
              .map((sku, index) => {
                return sku.skuIdentifier;
              })
              .join(', ');
            googleData.paywallSkus = skus;
          }

          if (analyticsItems.paywallName) {
            let paywallName = analyticsItems.paywallName;
            googleData.paywallName = paywallName;
          }
          if (analyticsItems.paywallID) {
            let paywallID = analyticsItems.paywallID;
            googleData.paywallID = paywallID;
          }
          if (analyticsItems.campaignName) {
            let campaignName = analyticsItems.campaignName;
            googleData.campaignName = campaignName;
          }
          if (analyticsItems.campaignID) {
            let campaignID = analyticsItems.campaignID;
            googleData.campaignID = campaignID;
          }
          if (analyticsItems.paywallType) {
            let paywallType = analyticsItems.paywallType;
            googleData.paywallType = paywallType;
          }
          if (analyticsItems.campaignType) {
            let campaignType = analyticsItems.campaignType;
            googleData.campaignType = campaignType;
          }
          if (analyticsItems.namiTriggered) {
            let namiTriggered = analyticsItems.namiTriggered;
            googleData.namiTriggered = namiTriggered;
          }
          await analytics().logEvent('PaywallView', googleData);
        }
        break;
      case 'purchase_activity':
        let purchaseData = {};
        if (analyticsItems.purchasedSKU) {
          purchaseData.purchaseSKU =
            analyticsItems.purchasedSKU.skuIdentifier;
          if (analyticsItems.purchasedSKULocale) {
            purchaseData.purchaseLocale =
              analyticsItems.purchasedSKULocale;
          }
        }
        if (analyticsItems.purchasedSKUPrice) {
          purchaseData.purchasePrice = `${analyticsItems.purchasedSKUPrice}`;
        }
        await analytics().logEvent('Purchase', purchaseData);
        break;
      default:
    }
  };

  const onNamiAnalyticsReceived = (event) => {
    console.log('ExampleApp: Analytics Dictionary was ', event);
    const {analyticsItems, actionType} = event;
    addAnalyticsEvent(analyticsItems, actionType);
  };

  useEffect(() => {
    console.log('ExampleApp: Nami Bridge is');
    console.log(NativeModules.NamiBridge);
    console.log('ExampleApp: firebase is ', firebase);

    if (
      eventEmitter?._subscriber?._subscriptionsForType?.PurchasesChanged == null
    ) {
      eventEmitter.addListener('PurchasesChanged', onPurchasesChanged);
    }

    if (
      analyticsEmitter?._subscriber?._subscriptionsForType?.NamiAnalyticsSent ==
      null
    ) {
      analyticsEmitter.addListener(
        'NamiAnalyticsSent',
        onNamiAnalyticsReceived,
      );
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
    NativeModules.NamiPurchaseManagerBridge.clearBypassStorePurchases();
  }, []);

  return <AppNavigation />;
};

export default App;
