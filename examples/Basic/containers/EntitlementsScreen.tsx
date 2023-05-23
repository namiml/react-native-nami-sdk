import React, {FC, useEffect, useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  NamiEntitlementManager,
  NamiEntitlement,
  NamiPaywallManager,
} from 'react-native-nami-sdk';

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
    NamiEntitlementManager.refresh((newEtitlements) => {
      console.log('newEtitlements', newEtitlements);
    });
  };

  const buySkuIosUsage = () => {
    NamiPaywallManager.buySkuCompleteIos({
      product: {
        id: '12345',
        platformID: '12345',
        skuId: '12345',
        languageCode: 'en-US',
        name: 'Some name',
        featured: true,
        storeId: '12345',
        type: 1,
        isFeatured: true,
        namiID: '12345',
      },
      transactionID: '12345',
      originalTransactionID: '12345',
      originalPurchaseDate: 1684823428,
      purchaseDate: 1684823428,
      expiresDate: 1684823428,
      price: '120',
      currencyCode: 'USD',
      locale: 'US',
    });
  };

  const buySkuAmazonUsage = () => {
    NamiPaywallManager.buySkuCompleteAmazon({
      product: {
        id: '12345',
        platformID: '12345',
        skuId: '12345',
        languageCode: 'en-US',
        name: 'Some name',
        featured: true,
        storeId: '12345',
        type: 1,
        isFeatured: true,
        namiID: '12345',
      },
      purchaseDate: 1684823428,
      expiresDate: 1684823428,
      purchaseSource: 'CAMPAIGN',
      receiptId: '12345',
      localizedPrice: '120',
      userId: '12345',
      marketplace: '12345',
    });
  };

  const buySkuAGooglePlayUsage = () => {
    NamiPaywallManager.buySkuCompleteGooglePlay({
      product: {
        id: '12345',
        platformID: '12345',
        skuId: '12345',
        languageCode: 'en-US',
        name: 'Some name',
        featured: true,
        storeId: '12345',
        type: 1,
        isFeatured: true,
        namiID: '12345',
      },
      purchaseDate: 1684823428,
      expiresDate: 1684823428,
      purchaseSource: 'CAMPAIGN',
      purchaseToken: '12345',
      orderId: '12345',
    });
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
