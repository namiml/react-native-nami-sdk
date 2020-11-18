'use strict';
import theme from '../../theme';
import {Text, StyleSheet, ImageBackground} from 'react-native';
import {
  View
} from 'react-native';

import React from 'react';

const Header = () => (
  <View style={styles.wrapper}>
    <ImageBackground
      accessibilityRole={'image'}
      source={require('../../logo.png')}
      style={styles.background}
      imageStyle={styles.logo}>
      <Text></Text>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  background: {
    paddingHorizontal: 32,
    paddingTop: 10,
    paddingBottom: 35,
  },
  logo: {
    overflow: 'visible',
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primary,
  }
});

export default Header;
