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
  NamiPaywallAction,
  NamiCampaignRuleType,
} from 'react-native-nami-sdk';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { ViewerTabProps } from '../App';
import theme from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type CampaignScreenProps = ViewerTabProps<'Campaign'>

const HeaderRight = ({ onRefreshPress }: {onRefreshPress: () => void}) => (
  <TouchableOpacity
    testID="refresh_campaigns"
    style={styles.headerButton}
    onPress={onRefreshPress}>
    <Text style={styles.headerButtonText}>Refresh</Text>
  </TouchableOpacity>
);

// For Nami testing purposes only
const HeaderLeft = ({ onButtonPress } : { onButtonPress: () => void }) => (
  <TouchableOpacity
    style={styles.headerButton}
    onPress={onButtonPress}>
    <Text
      testID="show_paywall_button"
      style={styles.headerButtonText}>
      Show Paywall
    </Text>
  </TouchableOpacity>
);

const CampaignScreen: FC<CampaignScreenProps> = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [campaignsAction, setAction] = useState<NamiPaywallAction | string>(
    'INITIAL',
  );

  const showPaywallIfHidden = async () => {
    try {
      const isHidden = await NamiPaywallManager.isHidden()
      if (Platform.OS === 'ios' && isHidden) {
        NamiPaywallManager.show();
      } else {
        console.log('paywall is not hidden');
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        NamiPaywallManager.dismiss();
      },
    );

    const subscriptionRestoreRemover =
      NamiPaywallManager.registerRestoreHandler(() => {
        console.log('restore');
        NamiPaywallManager.dismiss();
      });

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
      subscriptionRestoreRemover();
      // Clean up the launch subscription when the component unmounts
      // For safety reasons
      if (NamiCampaignManager.launchSubscription) {
        NamiCampaignManager.launchSubscription.remove();
      }
    };
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerLaunch = (label?: any, url?: any) => {
    return NamiCampaignManager.launch(
      label,
      url,
      { customAttributes: {} },
      (successAction, error) => {
        console.log('successAction', successAction);
        console.log('error', error);
      },
      (
        action,
        campaignId,
        paywallId,
        campaignName,
        campaignType,
        campaignLabel,
        campaignUrl,
        paywallName,
        segmentId,
        externalSegmentId,
        deeplinkUrl,
        skuId,
        componentChangeId,
        componentChangeName,
        purchaseError,
        purchases,
      ) => {
        console.log('action', action);
        setAction(action);
        console.log('campaignId', campaignId);
        console.log('paywallId', paywallId);
        console.log('campaignName', campaignName);
        console.log('campaignType', campaignType);
        console.log('campaignLabel', campaignLabel);
        console.log('campaignUrl', campaignUrl);
        console.log('paywallName', paywallName);
        console.log('segmentId', segmentId);
        console.log('externalSegmentId', externalSegmentId);
        console.log('deeplinkUrl', deeplinkUrl);
        console.log('skuId', skuId);
        console.log('componentChangeId', componentChangeId);
        console.log('componentChangeName', componentChangeName);
        console.log('purchaseError', purchaseError);
        console.log('purchases', purchases);
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
    getAllCampaigns();
    setRefresh(!refresh);
    NamiCampaignManager.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onButtonPress = useCallback(() => {
    showPaywallIfHidden();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          onRefreshPress={() => {
            getAllCampaigns();
            setRefresh(!refresh);
            NamiCampaignManager.refresh();
          }}
        />
      ),
      headerLeft: () => <HeaderLeft onButtonPress={onButtonPress} />,
    });
  }, [navigation, onRefreshPress, onButtonPress, getAllCampaigns, refresh]);

  const renderItem = ({ item, index }: {item: NamiCampaign; index: number}) => {
    const lasItem = index === campaigns.length - 1;
    const itemStyle = lasItem ? [styles.item, styles.lastItem] : styles.item;
    return (
      <TouchableOpacity
        testID={`list_item_${item.value}`}
        accessibilityValue={{ text: JSON.stringify(item) }}
        onPress={() => onItemPressPrimary(item)}
        style={itemStyle}>
        <View
          testID={`list_item_view_${item.value}`}
          accessibilityValue={{ text: JSON.stringify(item) }}
          style={styles.viewContainer}>
          <Text style={styles.itemText}>{item.value}</Text>
          {item.type === NamiCampaignRuleType.URL && (
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
    <SafeAreaView
      style={styles.container}
      edges={['right', 'bottom', 'left']}>
      <View>
        <Text
          testID="campaigns_title"
          style={styles.title}>
            Campaigns
        </Text>
        <View
          testID="unlabeled_campaigns"
          style={styles.marginTop20}>
          <Text style={styles.sectionHeader}>LIVE UNLABELED CAMPAIGNS</Text>
          {renderDefault()}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.statusText}>Modal Status:</Text>
          <Text
            testID="campaigns_modal_action"
            style={styles.statusText}>
            {campaignsAction}
          </Text>
        </View>
        <Text
          testID="refresh_status_text"
          style={styles.statusText}>
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh} />
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
