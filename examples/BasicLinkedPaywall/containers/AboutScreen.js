import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  NativeModules
} from 'react-native';

import theme from '../theme';

import Header from '../components/Header/Header';

const AboutScreen = (props) => {

  useEffect(() => {
    console.log('Entering About Screen.');
    NativeModules.NamiBridge.enterCoreContentWithLabel("AboutScreen");

    return () => {
      console.log('Exiting About Screen.');
      NativeModules.NamiBridge.exitCoreContentWithLabel("AboutScreen");
    };
  }, [props.navigation]);

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
              <Text style={styles.sectionTitle}> <Text style={styles.sectionTitle}>Introduction</Text></Text>
              <Text style={styles.sectionDescription}>
                This application demonstrates common calls used in a Nami enabled application.
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

export default AboutScreen;
