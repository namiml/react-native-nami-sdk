import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { NamiEntitlementManager, NamiEntitlement } from 'react-native-nami-sdk';

import theme from '../../theme';
import { ViewerTabProps } from '../App';

type EntitlementsScreenProps = ViewerTabProps<'Entitlements'>;

const EntitlementsScreen: FC<EntitlementsScreenProps> = ({ navigation }) => {
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
    NamiEntitlementManager.refresh((newEtitlements: any) => {
      console.log('newEntitlements', newEtitlements);
    });
  };

  useEffect(() => {
    getAllEntitlements();
    const subscriptionRemover =
      NamiEntitlementManager.registerActiveEntitlementsHandler(
        (activeEntitlements: React.SetStateAction<NamiEntitlement[]>) => {
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
            <Text
              testID="refresh_entitlements"
              style={styles.headerButtonText}>
              Refresh
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
        style={styles.item}>
        <Text style={styles.itemText}>{item.referenceId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
  headerButtonText: {
    color: theme.links,
    fontSize: 16,
  },
});

export default EntitlementsScreen;
