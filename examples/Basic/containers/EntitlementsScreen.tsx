import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NamiEntitlementManager, NamiEntitlement } from 'react-native-nami-sdk';

import { ViewerTabProps } from '../App';

import theme from '../theme';

type EntitlementsScreenProps = ViewerTabProps<'Entitlements'>;

const EntitlementsScreen: FC<EntitlementsScreenProps> = ({ navigation }) => {
  const [entitlements, setEntitlements] = useState<NamiEntitlement[]>([]);

  const getAllEntitlements = async () => {
    const allEntitlements = await NamiEntitlementManager.active();
    console.log('activeEntitlements', allEntitlements);
    setEntitlements(allEntitlements);
  };

  const onItemPress = async (referenceId: string) => {
    const isEntitlementActive =
      await NamiEntitlementManager.isEntitlementActive(referenceId);
    console.log('isEntitlementActive', isEntitlementActive);
  };

  const onRefreshPress = () => {
    NamiEntitlementManager.refresh(newEntitlements => {
      console.log('refreshedEntitlements', newEntitlements);
    });
  };

  const onClearPress = () => {
    NamiEntitlementManager.clearProvisionalEntitlementGrants();
  };

  useEffect(() => {
    getAllEntitlements();
    const subscriptionRemover =
      NamiEntitlementManager.registerActiveEntitlementsHandler(
        activeEntitlements => {
          console.log('activeEntitlements', activeEntitlements);
          setEntitlements(activeEntitlements);
        },
      );
    return () => {
      subscriptionRemover();
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onRefreshPress}
          >
            <Text
              testID="refresh_entitlements"
              style={styles.headerButtonText}>
              Refresh
            </Text>
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        return (
          <TouchableOpacity
            style={styles.headerLeftButton}
            onPress={onClearPress}
          >
            <Text
              testID="clear_entitlements"
              style={styles.headerButtonText}>
              Clear
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  const renderCampaigns = ({ item }: {item: NamiEntitlement}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onItemPress(item.referenceId);
        }}
        style={styles.item}
      >
        <Text style={styles.itemText}>{item.referenceId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['right', 'bottom', 'left']}>
      <Text
        testID="entitlements_title"
        style={styles.title}>
        Entitlements
      </Text>
      <View style={styles.section}>
        <Text
          testID="active_entitlement"
          style={styles.sectionHeader}>
          ACTIVE ENTITLEMENT
        </Text>
        <FlatList
          testID="entitlement_list"
          data={entitlements}
          renderItem={renderCampaigns}
        />
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
  headerLeftButton: {
    marginLeft: 15,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: theme.links,
    fontSize: 16,
  },
});

export default EntitlementsScreen;
