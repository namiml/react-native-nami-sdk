import React, {FC, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {NamiCustomerManager} from 'react-native-nami-sdk';

import {ViewerTabProps} from '../App';

import theme from '../theme';

const TEST_KEY = 'key1';

interface CustomerManagerScreenProps
  extends ViewerTabProps<'CustomerManager'> {}

const CustomerManagerScreen: FC<CustomerManagerScreenProps> = () => {
  const [value, onChangeValue] = useState<string>('');
  const [attribute, setAttribute] = useState<string>('');
  const [inAnonymousMode, setInAnonymousMode] = useState<boolean>(false);

  const handleSetAttribute = () => {
    NamiCustomerManager.setCustomerAttribute(TEST_KEY, value);
    handleGetAttribute();
  };

  const handleClearAttribute = () => {
    NamiCustomerManager.clearCustomerAttribute(TEST_KEY);
    handleGetAttribute();
  };

  const handleGetAttribute = async () => {
    const attributeNami = await NamiCustomerManager.getCustomerAttribute(
      TEST_KEY,
    );
    console.log('customer attribute', attributeNami);
    setAttribute(attributeNami ? attributeNami : '');
    onChangeValue('');
  };

  const handleAnonymousMode = () => {
    const anonymousMode = await NamiCustomerManager.inAnonymousMode();
    setInAnonymousMode(anonymousMode);
    console.log('anonymous mode currently: ', inAnonymousMode)
    NamiCustomerManager.setAnonymousMode(!inAnonymousMode);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text testID="customer_manager_title" style={styles.title}>
        Customer Manager
      </Text>
      <View style={styles.section}>
        <Text testID="customer_attribute" style={styles.sectionHeader}>
          Set Customer Attribute
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            testID="customer_attribute_input"
            style={styles.input}
            onChangeText={onChangeValue}
            value={value}
            placeholder="value"
            keyboardType="default"
          />
          <TouchableOpacity
            testID="send_btn"
            style={styles.sendBtn}
            onPress={handleSetAttribute}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Stored custom attribute value</Text>
        <Text testID="customer_attribute_text" style={styles.attributeText}>
          {attribute}
        </Text>

        <TouchableOpacity
          testID="clear_attribute_btn"
          style={styles.clearBtn}
          onPress={handleClearAttribute}>
          <Text>Clear Attribute</Text>
        </TouchableOpacity>


        <TouchableOpacity
          testID="anonymous_mode_btn"
          style={styles.anonBtn}
          onPress={handleAnonymousMode}>
          <Text>Toggle Anonymous Mode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 8,
  },
  itemText: {
    color: theme.links,
  },
  container: {
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  sectionHeader: {
    color: theme.secondaryFont,
    marginLeft: 15,
    marginBottom: 5,
  },
  section: {
    marginTop: 20,
  },
  headerButton: {
    marginRight: 15,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: theme.links,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: theme.secondaryFont,
  },
  sendBtn: {
    backgroundColor: theme.light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  attributeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 15,
    color: theme.primary,
  },
  clearBtn: {
    alignItems: 'center',
    backgroundColor: theme.light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 15,
    marginVertical: 30,
  },
  anonBtn: {
    alignItems: 'center',
    backgroundColor: theme.light,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 15,
    marginVertical: 30,
  },
});

export default CustomerManagerScreen;
