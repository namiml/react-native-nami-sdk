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
import {NamiPaywallAction} from 'react-native-nami-sdk/src/NamiPaywallManager';

interface CampaignScreenProps extends ViewerTabProps<'Campaign'> {}

const CampaignScreen: FC<CampaignScreenProps> = ({navigation}) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [campaignsAction, setAction] = useState<NamiPaywallAction | string>(
    'INITIAL',
  );

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
          setAction(action);
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
          const isEqualList =
            JSON.stringify(campaigns) === JSON.stringify(availableCampaigns);
          setRefresh(isEqualList ? false : true);
          setCampaigns(availableCampaigns);
        },
      );
    return () => {
      subscriptionRemover();
    };
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onRefreshPress}>
            <Text testID="refresh_campaigns" style={styles.headerButtonText}>
              Refresh
            </Text>
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
        <View
          testID={`list_item_${item.value}`}
          accessibilityValue={{text: JSON.stringify(item)}}>
          <Text style={styles.itemText}>{item.value}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDefault = () => {
    return (
      <TouchableOpacity
        testID="default_campaigns"
        onPress={() => onItemPress()}
        style={styles.itemDef}>
        <Text style={styles.itemText}>default</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text testID="campaigns_title" style={styles.title}>
        Campaigns
      </Text>
      <View testID="unlabeled_campaigns" style={styles.section}>
        <Text style={styles.sectionHeader}>LIVE UNLABELED CAMPAIGNS</Text>
        {renderDefault()}
      </View>
      <Text testID="campaigns_modal_action" style={styles.statusText}>
        Modal Status: {campaignsAction}
      </Text>
      <Text testID="refresh_status_text" style={styles.statusText}>
        Refreshed: {refresh.toString()}
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>LIVE LABELED CAMPAIGNS</Text>
        <FlatList
          testID="campaigns_list"
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
  statusText: {
    color: theme.secondaryFont,
    marginLeft: 15,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default CampaignScreen;
