import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  NamiCampaign,
  NamiCampaignManager,
  NamiPaywallManager,
} from 'react-native-nami-sdk';
import {NamiPaywallAction} from 'react-native-nami-sdk/src/NamiPaywallManager';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

// For Nami testing purposes only
const HeaderLeft = ({onButtonPress}: {onButtonPress: () => void}) => (
  <TouchableOpacity style={styles.headerButton} onPress={onButtonPress}>
    <Text testID="show_paywall_button" style={styles.headerButtonText}>
      Show Paywall
    </Text>
  </TouchableOpacity>
);

const CampaignScreen: FC<CampaignScreenProps> = ({navigation}) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [campaignsAction, setAction] = useState<NamiPaywallAction | string>(
    'INITIAL',
  );

  const getAllCampaigns = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.allCampaigns();
    const validCampaigns = fetchedCampaigns.filter((campaign) =>
      Boolean(campaign.value),
    );
    setCampaigns(validCampaigns);
    console.log('validCampaigns', validCampaigns);
    return validCampaigns;
  }, []);

  useEffect(() => {
    getAllCampaigns();
    const subscriptionSignInRemover = NamiPaywallManager.registerSignInHandler(
      () => {
        console.log('sign in');
        NamiPaywallManager.hide();
      },
    );
    const subscriptionRemover =
      NamiCampaignManager.registerAvailableCampaignsHandler(
        (availableCampaigns) => {
          console.log('availableCampaigns', availableCampaigns);
          const isEqualList =
            JSON.stringify(campaigns) === JSON.stringify(availableCampaigns);
          setRefresh(!isEqualList);
          setCampaigns(availableCampaigns);
        },
      );
    return () => {
      subscriptionRemover();
      subscriptionSignInRemover();
    };
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerLaunch = (label?: any, url?: any) => {
    // const paywallLaunchContext = {
    //   productGroups: ['group1'],
    // };
    return NamiCampaignManager.launch(
      label,
      url,
      undefined,
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
        campaignName,
        campaignType,
        campaignUrl,
        segmentId,
        externalSegmentId,
        paywallName,
        deeplinkUrl,
      ) => {
        console.log('action', action);
        setAction(action);
        console.log('skuId', skuId);
        console.log('purchaseError', purchaseError);
        console.log('purchases', purchases);
        console.log('campaignId', campaignId);
        console.log('campaignLabel', campaignLabel);
        console.log('campaignName', campaignName);
        console.log('campaignType', campaignType);
        console.log('campaignUrl', campaignUrl);
        console.log('paywallId', paywallId);
        console.log('paywallName', paywallName);
        console.log('segmentId', segmentId);
        console.log('externalSegmentId', externalSegmentId);
        console.log('deeplinkUrl', deeplinkUrl);
      },
    );
  };

  const isCampaignAvailable = async (value?: string | null | undefined) => {
    try {
      return await NamiCampaignManager.isCampaignAvailable(value ?? '');
    } catch (error) {
      console.error(
        `Failed to check campaign availability in isCampaignAvailable: ${error}`,
      );
    }
  };

  const onItemPressPrimary = useCallback(async (item: NamiCampaign) => {
    if (await isCampaignAvailable(item.value)) {
      item.type === 'label'
        ? triggerLaunch(item.value, null)
        : triggerLaunch(null, item.value);
    }
  }, []);

  const onItemPressDefault = useCallback(() => triggerLaunch(null, null), []);

  const onRefreshPress = useCallback(() => {
    NamiCampaignManager.refresh();
  }, []);

  const onButtonPress = useCallback(() => {
    NamiPaywallManager.show();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRight onRefreshPress={onRefreshPress} />,
      headerLeft: () => <HeaderLeft onButtonPress={onButtonPress} />,
    });
  }, [navigation, onRefreshPress, onButtonPress]);

  const renderItem = ({item, index}: {item: NamiCampaign; index: number}) => {
    const lasItem = index === campaigns.length - 1;
    const itemStyle = lasItem ? [styles.item, styles.lastItem] : styles.item;
    return (
      <TouchableOpacity
        onPress={() => onItemPressPrimary(item)}
        style={itemStyle}>
        <View
          style={styles.viewContainer}
          testID={`list_item_${item.value}`}
          accessibilityValue={{text: JSON.stringify(item)}}>
          <Text style={styles.itemText}>{item.value}</Text>
          {item.type === 'url' && (
            <Text style={styles.itemText}>Open as: {item.type}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const SeparatorComponent = () => <View style={styles.separator} />;

  const renderDefault = () => {
    return (
      <TouchableOpacity
        testID="default_campaigns"
        onPress={() => onItemPressDefault()}
        style={styles.itemDef}>
        <Text style={styles.itemText}>default</Text>
      </TouchableOpacity>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    getAllCampaigns().then(() => {
      setRefreshing(false);
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <View>
        <Text testID="campaigns_title" style={styles.title}>
          Campaigns
        </Text>
        <View testID="unlabeled_campaigns" style={styles.marginTop20}>
          <Text style={styles.sectionHeader}>LIVE UNLABELED CAMPAIGNS</Text>
          {renderDefault()}
        </View>
        <Text testID="campaigns_modal_action" style={styles.statusText}>
          Modal Status: {campaignsAction}
        </Text>
        <Text testID="refresh_status_text" style={styles.statusText}>
          Refreshed: {refresh.toString()}
        </Text>
      </View>
      <View style={styles.bottomContent}>
        <Text style={styles.sectionHeader}>LIVE LABELED CAMPAIGNS</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          testID="campaigns_list"
          data={campaigns}
          style={styles.list}
          renderItem={renderItem}
          ItemSeparatorComponent={SeparatorComponent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    paddingBottom: 10,
  },
  sectionHeader: {
    color: theme.secondaryFont,
    marginLeft: 15,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: theme.light,
  },
  item: {
    backgroundColor: theme.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  lastItem: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
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
  marginTop20: {
    marginTop: 20,
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CampaignScreen;
