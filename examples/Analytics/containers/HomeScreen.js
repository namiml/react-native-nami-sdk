import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

import theme from '../theme';

import Header from '../components/Header/Header';

import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';

const HomeScreen = (props) => {

  const {navigate} = props.navigation;
  const [products, setProducts] = useState([])
  const { NamiEmitter } = NativeModules;
  const { NamiAnalyticsEmitter } = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);
  const analyticsEmitter = new NativeEventEmitter(NamiAnalyticsEmitter);

  const subscribeAction = () => {
    NativeModules.NamiPaywallManagerBridge.raisePaywall()
  }

  const onSessionConnect = (event) => {
	  console.log("Products changed: ", event);
    setProducts(event.products)
  }

  const addAnalyticEvent = async (analyticsItems, actionType) => {
    let googleData = {};
    switch (actionType) {
      case 'paywall_raise':
        if (analyticsItems) {
          if(analyticsItems.paywallProducts && analyticsItems.paywallProducts.length) {
            let products = analyticsItems.paywallProducts.map((product, index) => {
             return product.productIdentifier
            }).join(', ')
            googleData["paywallProducts"] = products;
          }
          
          if (analyticsItems.paywallName) {
            let paywallName = analyticsItems.paywallName
            googleData["paywallName"] = paywallName
          } if (analyticsItems.paywallID) {
            let paywallID = analyticsItems.paywallID
            googleData["paywallID"] = paywallID
          } if (analyticsItems.campaignName) {
            let campaignName = analyticsItems.campaignName
            googleData["campaignName"] = campaignName
          } if (analyticsItems.campaignID) {
            let campaignID = analyticsItems.campaignID
            googleData["campaignID"] = campaignID
          } if (analyticsItems.paywallType) {
            let paywallType = analyticsItems.paywallType
            googleData["paywallType"] = paywallType
          } if (analyticsItems.campaignType) {
            let campaignType = analyticsItems.campaignType
            googleData["campaignType"] = campaignType
          } if (analyticsItems.namiTriggered) {
            let namiTriggered = analyticsItems.namiTriggered
            googleData["namiTriggered"] = namiTriggered
          }
          await analytics().logEvent('PaywallView', googleData);
        }
        break;
      case 'paywall_closed':
        break;
      case 'paywall_raise_blocked':
        break;
      case 'purchase_activity':
        let purchaseData = {};
        if(analyticsItems.purchasedProduct_NamiMetaProduct) {
          purchaseData["purchaseProduct"] = analyticsItems.purchasedProduct_NamiMetaProduct.productIdentifier;
          if(product.product.priceLocale.regionCode) {
            purchaseData["purchaseLocale"] = product.product.priceLocale.regionCode
          }
        } if(analyticsItems.purchasedProductPrice) {
          purchaseData["purchasePrice"] = `${analyticsItems.purchasedProductPrice}`
        }
        await analytics().logEvent('Purchase', purchaseData);
      default:
        break;
    }
  }

  const onNamiAnalyticsReceived = (event) => {
    console.log("Analytics Dictionary ", event);
    const { analyticsItems, actionType} = event;
    addAnalyticEvent(analyticsItems, actionType)
  }



  useEffect(() => {

    console.log('Starting Nami.')
    console.log(firebase)

    // Need to find somewhere that can activate this sooner
    NativeModules.NamiStoreKitHelperBridge.clearBypassStoreKitPurchases();
    NativeModules.NamiStoreKitHelperBridge.bypassStoreKit(true);
    NativeModules.NamiBridge.configureWithAppID("002e2c49-7f66-4d22-a05c-1dc9f2b7f2af");

    eventEmitter.addListener('PurchasesChanged', onSessionConnect);
    analyticsEmitter.addListener('NamiAnalyticsSent', onNamiAnalyticsReceived);

  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
            <Button title="Go to About" onPress={() => navigate('About')}/>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Introduction</Text>
              <Text style={styles.sectionDescription}>
                This application demonstrates common calls used in a Nami enabled application and sends analytics data about Paywalls and Purchases to Google Analytics.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.sectionDescription}>
                If you suspend and resume this app three times in the simulator, an example paywall will be raised - or you can use the <Text style={styles.highlight}>Subscribe</Text> button below to raise the same paywall.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Important info</Text>
              <Text style={styles.sectionDescription}>
                Any Purchase will be remembered while the application is <Text style={styles.highlight}>Active</Text>, <Text style={styles.highlight}>Suspended</Text>, <Text style={styles.highlight}>Resume</Text>,
                but cleared when the application is launched.
              </Text>
              <Text style={styles.sectionDescription}>
                Examine the application source code for more details on calls used to respond and monitor purchases.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              { products.length === 0 ? <Button title="Subscribe" onPress={subscribeAction}/>  : <Button title="Change Subscription" onPress={subscribeAction} />}
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionMiddle}>
	             Subscription is: { products.length === 0  ?  <Text style={styles.danger}>Inactive</Text>   : <Text style={styles.success}>Active</Text>}
			        </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: theme.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: theme.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: theme.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: theme.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  sectionMiddle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  success: {
    color: 'green'
  },
  danger: {
    color: 'red'
  }
});

export default HomeScreen;
