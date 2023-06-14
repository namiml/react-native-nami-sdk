import React, {FC, useEffect, useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NamiCampaignManager, NamiCampaign} from 'react-native-nami-sdk';

import {ViewerTabProps} from '../App';

import theme from '../theme';

interface CampaignScreenProps extends ViewerTabProps<'Campaign'> {}

const CampaignScreen: FC<CampaignScreenProps> = ({navigation}) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);

  const getAllCampaigns = async () => {
    const allCampaigns = await NamiCampaignManager.allCampaigns();
    console.log('allCampaigns', allCampaigns);
    setCampaigns(allCampaigns);
  };

  const onItemPress = async (label?: string) => {
    const isCampaignAvailable = await NamiCampaignManager.isCampaignAvailable(
      label,
    );
    if (isCampaignAvailable) {
      NamiCampaignManager.launch(
        label,
        null,
        (successAction, error) => {
          console.log('successAction', successAction);
          console.log('error', error);
        },
        (
          action,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId,
        ) => {
          console.log('action', action);
          console.log('skuId', skuId);
          console.log('purchaseError', purchaseError);
          console.log('purchases', purchases);
          console.log('campaignId', campaignId);
          console.log('campaignLabel', campaignLabel);
          console.log('paywallId', paywallId);
        },
      );
    }
  };

  const onRefreshPress = () => {
    NamiCampaignManager.refresh();
  };

  useEffect(() => {
    getAllCampaigns();
    const subscriptionRemover =
      NamiCampaignManager.registerAvailableCampaignsHandler(
        (availableCampaigns) => {
          console.log('availableCampaigns', availableCampaigns);
          setCampaigns(availableCampaigns);
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

  const renderCampaigns = ({item}: {item: NamiCampaign}) => {
    if (!item.value) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item.value ?? undefined)}
        style={styles.item}>
        <Text style={styles.itemText}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const renderDefault = () => {
    return (
      <TouchableOpacity onPress={() => onItemPress()} style={styles.itemDef}>
        <Text style={styles.itemText}>default</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Campaigns</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>LIVE UNLABELED CAMPAIGNS</Text>
        {renderDefault()}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>LIVE LABELED CAMPAIGNS</Text>
        <FlatList
          data={campaigns}
          renderItem={renderCampaigns}
          style={styles.list}
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
  },
  itemDef: {
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
  list: {
    borderRadius: 8,
  },
});

export default CampaignScreen;
