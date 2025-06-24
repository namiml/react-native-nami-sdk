import React, { FC, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NamiCustomerManager } from 'react-native-nami-sdk';

import { ViewerTabProps } from '../App';

import theme from '../theme';

const TEST_KEY = 'key1';

type CustomerManagerScreenProps = ViewerTabProps<'CustomerManager'>

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

  const handleAnonymousMode = async () => {
    const anonymousMode = await NamiCustomerManager.inAnonymousMode();
    setInAnonymousMode(anonymousMode);
    console.log('anonymous mode currently: ', inAnonymousMode);
  };

  const toggleAnonymousMode = () => {
    NamiCustomerManager.setAnonymousMode(!inAnonymousMode);
    handleAnonymousMode();
  };

  useEffect(() => {
    if (inAnonymousMode) {
      handleAnonymousMode();
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inAnonymousMode]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['right', 'bottom', 'left']}>
      <Text
        testID="customer_manager_title"
        style={styles.title}>
        Customer Manager
      </Text>
      <View style={styles.section}>
        <Text
          testID="customer_attribute"
          style={styles.sectionHeader}>
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
        <Text
          testID="customer_attribute_text"
          style={styles.attributeText}>
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
          onPress={toggleAnonymousMode}>
          <Text>
            {inAnonymousMode
              ? 'Turn Anonymous Mode off'
              : 'Turn Anonymous Mode on'}
          </Text>
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
    flex: 1,
    flexDirection: 'column',
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
