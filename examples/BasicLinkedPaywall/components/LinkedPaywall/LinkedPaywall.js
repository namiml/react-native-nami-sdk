import React from 'react';
import { Modal, Text, View, StyleSheet, ImageBackground, TouchableOpacity, NativeModules } from 'react-native';
import theme from '../../theme';

const LinkedPaywall = (props) => {
  const { open, setOpen, data } = props;
  const { title, body } = data.paywallMetadata.marketing_content;
  const { background_image_url_phone } = data.paywallMetadata;
  const { products } = data;

  const purchase = (productIdentifier) => {
    NativeModules.NamiStoreKitHelperBridge.buyProduct(productIdentifier,
      (purchased) => {
        if (purchased) {
          setOpen(!open)
        }
      }
    );
  }
  
  return (

    <Modal
      animationType="slide"
      transparent={false}
      visible={open}
      presentationStyle='formSheet'
      onRequestClose={() => {
        Alert.alert('LinkedPaywall has been closed.');
      }}>
      <ImageBackground source={{ uri: background_image_url_phone }} style={{ width: '100%', height: '100%' }}>
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            onPress={() => setOpen(!open)}
            underlayColor='#fff'>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionDescription}>{body}</Text>
        </View>
        <View style={styles.subscriptions}>
          <View style={styles.sectionContainer}>
            {products.map((product, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.subscriptionButton}
                  onPress={() => purchase(product.productIdentifier)}
                  underlayColor='#fff'>
                  <Text style={styles.subscriptionText}>{product.localizedTitle} - {product.localizedMultipliedPrice}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({

  subscriptions: {
    backgroundColor: theme.white,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 340,
    borderRadius: 20
  },
  sectionContainer: {
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.white,
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },

  sectionDescription: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '500',
    color: theme.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  close: {
    color: 'black',
    textAlign: 'right'
  },

  subscriptionButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: theme.black,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.white
  },
  subscriptionText: {
    color: theme.white,
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: '600'
  }
});

export default LinkedPaywall;