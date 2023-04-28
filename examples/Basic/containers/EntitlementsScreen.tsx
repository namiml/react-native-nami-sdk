import React, {FC, useEffect, useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NamiEntitlementManager, NamiEntitlement} from 'react-native-nami-sdk';

import {ViewerTabProps} from '../App';

import theme from '../theme';

interface EntitlementsScreenProps extends ViewerTabProps<'Entitlements'> {}

const EntitlementsScreen: FC<EntitlementsScreenProps> = ({navigation}) => {
  const [entitlements, setEntitlements] = useState<NamiEntitlement[]>([]);

  const getAllEntitlements = async () => {
    const allEntitlements = await NamiEntitlementManager.active();
    console.log('allEntitlements', allEntitlements);
    setEntitlements(allEntitlements);
  };

  const onItemPress = async (referenceId: string) => {
    const isEntitlementActive =
      await NamiEntitlementManager.isEntitlementActive(referenceId);
    console.log('isEntitlementActive', isEntitlementActive);
  };

  const onRefreshPress = () => {
    NamiEntitlementManager.refresh();
  };

  useEffect(() => {
    getAllEntitlements();
    const subscriptionRemover =
      NamiEntitlementManager.registerActiveEntitlementsHandler(
        (activeEntitlements) => {
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
            onPress={onRefreshPress}>
            <Text style={styles.headerButtonText}>Refresh</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  const renderCampaigns = ({item}: {item: NamiEntitlement}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onItemPress(item.referenceId);
        }}
        style={styles.item}>
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Entitlements</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ACTIVE ENTITLEMENT</Text>
        <FlatList data={entitlements} renderItem={renderCampaigns} />
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
});

export default EntitlementsScreen;
