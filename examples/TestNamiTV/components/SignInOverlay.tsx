import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NamiCustomerManager } from 'react-native-nami-sdk';
// import { v4 as uuidv4 } from 'uuid';

export const SignInOverlay: React.FC<any> = ({ onFinish, ...props }) => {
  console.log('[SignInOverlay] Rendering with props:', props);
  console.log('[SignInOverlay] onFinish callback:', typeof onFinish);

  const handleLogin = () => {
    console.log('[SignInOverlay] Login button pressed');
    NamiCustomerManager.login('12311145');
    if (onFinish) {
      onFinish({ loggedIn: true, userId: '12311145' });
    }
  };

  const handleSkip = () => {
    console.log('[SignInOverlay] Skip button pressed');
    console.log('[SignInOverlay] onFinish is:', onFinish);
    console.log('[SignInOverlay] Calling onFinish...');
    if (onFinish) {
      onFinish({ loggedIn: false });
    } else {
      console.error('[SignInOverlay] onFinish is not available!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In Required</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Login with random UUID</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSkip}>
        <Text style={styles.buttonText}>Don&apos;t Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'black', // Black background to clearly see the component
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
    color: 'white', // White text on black background
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
