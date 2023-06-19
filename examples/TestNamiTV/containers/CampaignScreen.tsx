import React, {
  FC,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
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

const HeaderRight = ({onRefreshPress}: {onRefreshPress: () => void}) => (
  <TouchableOpacity style={styles.headerButton} onPress={onRefreshPress}>
    <Text testID="refresh_campaigns" style={styles.headerButtonText}>
      Refresh
    </Text>
  </TouchableOpacity>
);

const CampaignScreen: FC<CampaignScreenProps> = ({navigation}) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);

  const getAllCampaigns = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.allCampaigns();
    const validCampaigns = fetchedCampaigns.filter((campaign) =>
      Boolean(campaign.value),
    );
    setCampaigns(validCampaigns);
    console.log('validCampaigns', validCampaigns);
  }, []);

  const onItemPress = useCallback(async (label?: string) => {
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
  }, []);

  const onRefreshPress = useCallback(() => {
    NamiCampaignManager.refresh();
  }, []);

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
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onRefreshPress={onRefreshPress} />,
    });
  }, [navigation, onRefreshPress]);

  const renderCampaigns = ({
    item,
    index,
  }: {
    item: NamiCampaign;
    index: number;
  }) => {
    const lasItem = index === campaigns.length - 1;
    const itemStyle = lasItem ? [styles.item, styles.lastItem] : styles.item;
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item.value ?? undefined)}
        style={itemStyle}>
        <Text style={styles.itemText}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const SeparatorComponent = () => <View style={styles.separator} />;

  const renderDefault = () => {
    return (
      <TouchableOpacity onPress={() => onItemPress()} style={styles.itemDef}>
        <Text style={styles.itemText}>default</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <View>
        <Text style={styles.title}>Campaigns</Text>
        <View style={styles.marginTop20}>
          <Text style={styles.sectionHeader}>LIVE UNLABELED CAMPAIGNS</Text>
          {renderDefault()}
        </View>
      </View>
      <View style={styles.bottomContent}>
        <Text style={styles.sectionHeader}>LIVE LABELED CAMPAIGNS</Text>
        <FlatList
          data={campaigns}
          renderItem={renderCampaigns}
          ItemSeparatorComponent={SeparatorComponent}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 15,
  },
  bottomContent: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.light,
  },
  lastItem: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  item: {
    backgroundColor: theme.white,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  itemDef: {
    backgroundColor: theme.white,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  itemText: {
    fontSize: 20,
    color: theme.links,
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
  marginTop20: {
    marginTop: 20,
  },
});

export default CampaignScreen;
