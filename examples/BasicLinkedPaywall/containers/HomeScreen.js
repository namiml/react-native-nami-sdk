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
  NativeModules
} from 'react-native';

import theme from '../theme';

import Header from '../components/Header/Header';
import LinkedPaywall from '../components/LinkedPaywall/LinkedPaywall';

const HomeScreen = (props) => {

  const {navigate} = props.navigation;
  const [products, setProducts] = useState([])
  const [ open, setOpen ] =  useState(false);
  const [data, setData] = useState(null);


  const { NamiEmitter } = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);

  const subscribeAction = () => {
      NativeModules.NamiPaywallManagerBridge.raisePaywall();
    
  }

  const onSessionConnect = (event) => {
	  console.log("Products changed: ", event);
    setProducts(event.products)
  }

  const onPaywallShouldRaise = (event) => {
    // Add code to present your custom paywall here
    console.log("Data for paywall raise ", event);
    setData(event);
    setOpen(!open);
  }

  const onSignInActivated = (event) => {
    // Add code to present UI for sign-in
    console.log("Data for sign-in ", event);
  }

  const activateAbout = () => {
    console.log('Triggering core action');
    NativeModules.NamiBridge.coreActionWithLabel("About");
    navigate('About') ;
  }


  useEffect(() => {

    console.log('Nami Bridge is');
    console.log(NativeModules.NamiBridge, 'NamiBridge');
    console.log(NativeModules.NamiPaywallManagerBridge, 'NamiPaywallManagerBridge')
    NativeModules.NamiBridge.configureWithAppID("eea3721d-a13f-4a94-872a-3c2b795953da");
    //    NativeModules.NamiBridge.configureWithAppID("2dc699a5-43c6-4e3a-9166-957e1640741b");
    //    NativeModules.NamiPaywallManagerBridge.canRaisePaywall( (result) => {
    //		       console.log("canRaisePaywall ", result);
    //	}
    //	);

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
            <Button title="Go to About" onPress={() => activateAbout()}/>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Introduction</Text>
              <Text style={styles.sectionDescription}>
                This application demonstrates common calls used in a Nami enabled application.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.sectionDescription}>
                if you suspend and resume this app three times in the simulator, an example paywall will be raised - or you can use the <Text style={styles.highlight}>Subscribe</Text> button below to raise the same paywall.
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
      { data && <LinkedPaywall open={open} setOpen={setOpen} data={data} />}
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
