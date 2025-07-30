// SignInScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NamiCustomerManager, NamiFlowManager } from 'react-native-nami-sdk';
import { v4 as uuidv4 } from 'uuid';

export const SignInScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    const randomUUID = uuidv4();
    NamiCustomerManager.login(randomUUID);
    NamiFlowManager.resume();
    navigation.goBack(); //dismiss modal
  };

  const handleSkip = () => {
    NamiFlowManager.resume();
    navigation.goBack(); //dismiss modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In Required</Text>
      <Button
        title="Login with random UUID"
        onPress={handleLogin} />
      <View style={styles.spacer} />
      <Button
        title="Don't Login"
        onPress={handleSkip} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    textAlign: 'center',
  },
  spacer: {
    height: 16,
  },
});
