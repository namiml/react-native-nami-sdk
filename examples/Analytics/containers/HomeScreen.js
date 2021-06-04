import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  NativeModules,
} from 'react-native';
import theme from '../theme';
import Header from '../components/Header/Header';
import {usePurchasesContext} from '../hooks/usePurchases';

const HomeScreen = (props) => {
  const {navigate} = props.navigation;
  const {purchases} = usePurchasesContext();

  const onPreparePaywallFinished = (result) => {
    if (result.success == true) {
      console.log('prepare paywall success')
        NativeModules.NamiPaywallManagerBridge.raisePaywall();
    } else {
        console.log("error is " + result.errorMessage );
    }
    eventEmitter.removeListener('PreparePaywallFinished', onPreparePaywallFinished);
  }

    
  const subscribeAction = () => {
    eventEmitter.addListener('PreparePaywallFinished', onPreparePaywallFinished);
    NativeModules.NamiPaywallManagerBridge.preparePaywallForDisplay(true, 2);
  };

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
              <Button title="Go to About" onPress={() => navigate('About')} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Introduction</Text>
              <Text style={styles.sectionDescription}>
                This application demonstrates common calls used in a Nami
                enabled application and sends analytics data about Paywalls and
                Purchases to Google Analytics.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.sectionDescription}>
                If you suspend and resume this app three times in the simulator,
                an example paywall will be raised - or you can use the{' '}
                <Text style={styles.highlight}>Subscribe</Text> button below to
                raise the same paywall.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Important info</Text>
              <Text style={styles.sectionDescription}>
                Any Purchase will be remembered while the application is{' '}
                <Text style={styles.highlight}>Active</Text>,{' '}
                <Text style={styles.highlight}>Suspended</Text>,{' '}
                <Text style={styles.highlight}>Resume</Text>, but cleared when
                the application is launched.
              </Text>
              <Text style={styles.sectionDescription}>
                Examine the application source code for more details on calls
                used to respond and monitor purchases.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              {purchases.length === 0 ? (
                <Button title="Subscribe" onPress={subscribeAction} />
              ) : (
                <Button title="Change Subscription" onPress={subscribeAction} />
              )}
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionMiddle}>
                Subscription is:{' '}
                {purchases.length === 0 ? (
                  <Text style={styles.danger}>Inactive</Text>
                ) : (
                  <Text style={styles.success}>Active</Text>
                )}
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
    color: 'green',
  },
  danger: {
    color: 'red',
  },
});

export default HomeScreen;
