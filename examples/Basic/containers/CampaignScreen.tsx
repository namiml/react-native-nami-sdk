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
  NamiFlowManager,
  NamiPaywallAction,
  NamiCampaignRuleType,
  NamiPaywallEvent,
} from 'react-native-nami-sdk';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal,
} from 'react-native';
import { ViewerTabProps } from '../App';
import theme from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { handleDeepLink } from '../services/deeplinking';
import { logger } from 'react-native-logs';
import { DynamicLaunchContextView } from '../components/LaunchContext/DynamicLaunchContextView';
import { LaunchContextResult } from '../components/LaunchContext/types';

const log = logger.createLogger();

type CampaignScreenProps = ViewerTabProps<'Campaign'>;

const HeaderRight = ({ onRefreshPress }: {onRefreshPress: () => void}) => (
  <TouchableOpacity
    style={styles.headerButton}
    onPress={onRefreshPress}>
    <Text
      testID="refresh_campaigns"
      style={styles.headerButtonText}>
      Refresh
    </Text>
  </TouchableOpacity>
);

// For Nami testing purposes only
const HeaderLeft = ({ onButtonPress }: {onButtonPress: () => void}) => (
  <TouchableOpacity
    style={styles.headerButtonLeft}
    onPress={onButtonPress}>
    <Text
      testID="show_paywall_button"
      style={styles.headerButtonText}>
      Show
    </Text>
  </TouchableOpacity>
);

const CampaignScreen: FC<CampaignScreenProps> = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [campaignsAction, setAction] = useState<NamiPaywallAction | string>(
    'INITIAL',
  );
  const [showLaunchContext, setShowLaunchContext] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<NamiCampaign | null>(null);
  const [hasLaunchContextConfig, setHasLaunchContextConfig] = useState(false);

  const checkIfPaywallOpen = async () => {
    const isOpen = await NamiPaywallManager.isPaywallOpen();
    log.debug('NamiSDK: paywall open? ', isOpen);

    const isFlowOpen = await NamiFlowManager.isFlowOpen();
    log.debug('NamiSDK: flow open? ', isFlowOpen);
  };

  const showPaywallIfHidden = async () => {
    try {
      const isHidden = await NamiPaywallManager.isHidden();
      if (Platform.OS === 'ios' && isHidden) {
        NamiPaywallManager.show();
      } else {
        log.debug('paywall is not hidden');
      }
    } catch (error) {
      log.debug(error);
    }
  };

  const getAllCampaigns = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.allCampaigns();
    const validCampaigns = fetchedCampaigns.filter(campaign =>
      Boolean(campaign.value),
    );

    const sortedCampaigns = validCampaigns.sort((a, b) =>
      (a.value ?? '').localeCompare(b.value ?? ''),
    );
    setCampaigns(sortedCampaigns);
    log.debug('validCampaigns', sortedCampaigns);
    return sortedCampaigns;
  }, []);

  const getRefreshedCampaigns = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.refresh();
    const refreshedCampaigns = fetchedCampaigns.filter(campaign =>
      Boolean(campaign.value),
    );
    setCampaigns(refreshedCampaigns);
    return refreshedCampaigns;
  }, []);

  useEffect(() => {
    // Initial load of campaigns
    getAllCampaigns();

    // Check if launch_context.json has valid configuration
    try {
      const launchContextConfig = require('../launch_context.json');
      const hasConfig = launchContextConfig && (
        launchContextConfig.productGroups ||
        launchContextConfig.customObject ||
        launchContextConfig.customAttributes
      );
      setHasLaunchContextConfig(!!hasConfig);
    } catch (error) {
      log.debug('No launch_context.json found or invalid configuration');
      setHasLaunchContextConfig(false);
    }

    const availableCampaignsRemover =
      NamiCampaignManager.registerAvailableCampaignsHandler(
        (availableCampaigns: NamiCampaign[]) => {
          const filteredCampaigns = availableCampaigns.filter(
            campaign => campaign.type !== 'default',
          );

          const isEqualList =
            JSON.stringify(campaigns) === JSON.stringify(filteredCampaigns);
          setRefresh(!isEqualList);

          const sortedCampaigns = filteredCampaigns.sort((a, b) =>
            (a.value ?? '').localeCompare(b.value ?? ''),
          );

          log.debug(sortedCampaigns);
          setCampaigns(sortedCampaigns);
        },
      );

    const subscriptionSignInRemover = NamiPaywallManager.registerSignInHandler(
      async () => {
        console.log('[NamiPaywallManager.registerSignInHandler] sign in');
        await NamiPaywallManager.dismiss();
      },
    );

    const subscriptionCloseRemover = NamiPaywallManager.registerCloseHandler(
      async () => {
        console.log('[NamiPaywallManager.registerCloseHandler] close');
        await NamiPaywallManager.dismiss();
      },
    );

    const subscriptionRestoreRemover =
      NamiPaywallManager.registerRestoreHandler(async () => {
        console.log('[NamiPaywallManager.registerRestoreHandler] restore');
        await NamiPaywallManager.dismiss();
      });

    const subscriptionDeeplinkRemover =
      NamiPaywallManager.registerDeeplinkActionHandler(async url => {
        console.log(
          '[NamiPaywallManager.registerDeeplinkActionHandler] deeplink action ',
          url,
        );

        // for testing:
        NamiPaywallManager.buySkuCancel();

        await NamiPaywallManager.dismiss();

        if (url) {
          handleDeepLink({ url });
        }
      });

    getAllCampaigns();

    return () => {
      availableCampaignsRemover();
      subscriptionSignInRemover();
      subscriptionCloseRemover();
      subscriptionRestoreRemover();
      subscriptionDeeplinkRemover();
    };
    //Note: not needed in depts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerLaunch = useCallback(async (
    label?: any,
    url?: any,
    launchContext?: LaunchContextResult
  ) => {
    checkIfPaywallOpen();

    // Check if the campaign is a Flow campaign and log it
    try {
      const isFlow = await NamiCampaignManager.isFlow(label, url);
      log.debug(`Campaign isFlow: ${isFlow} for label: ${label}, url: ${url}`);
    } catch (error) {
      log.debug(`Failed to check if campaign is Flow: ${error}`);
    }

    NamiPaywallManager.setAppSuppliedVideoDetails(
      'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'app-supplied-video',
    );

    const context = launchContext;

    log.debug('Launching with context:', context);

    return NamiCampaignManager.launch(
      label,
      url,
      context,
      (successAction, error) => {
        log.debug('successAction', successAction);
        log.debug('error', error);

        checkIfPaywallOpen();
      },
      (event: NamiPaywallEvent) => {
        // NamiPaywallManager.allowUserInteraction(false);

        // log.debug(`NamiPaywallEvent ${event}"`)
        log.debug(`NamiPaywallEvent action - ${event.action.toString()}"`);
        log.debug(
          `NamiPaywallEvent timeSpentOnPaywall - ${event.timeSpentOnPaywall?.toString()}"`,
        );
        log.debug(
          `NamiPaywallEvent component change id - ${event.componentChange?.id?.toString()}"`,
        );
        log.debug(
          `NamiPaywallEvent component change name - ${event.componentChange?.name?.toString()}"`,
        );
        log.debug(
          `NamiPaywallEvent video metadata url - ${event.videoMetadata?.url?.toString()}"`,
        );
        log.debug(
          `NamiPaywallEvent video metadata name - ${event.videoMetadata?.name?.toString()}"`,
        );
        log.debug(`NamiPaywallEvent sku name - ${event.sku?.name}"`);
        log.debug(`NamiPaywallEvent sku id - ${event.sku?.id}"`);
        log.debug(`NamiPaywallEvent sku skuId - ${event.sku?.skuId}"`);
        log.debug(`NamiPaywallEvent sku type - ${event.sku?.type}"`);
        log.debug(`NamiPaywallEvent sku promoId - ${event.sku?.promoId}"`);
        log.debug(
          `NamiPaywallEvent sku promoToken - ${event.sku?.promoToken}"`,
        );
        setAction(event.action);
      },
    );
  }, []);

  const isCampaignAvailable = async (value?: string | null | undefined) => {
    try {
      return await NamiCampaignManager.isCampaignAvailable(value ?? '');
    } catch (error) {
      console.error(
        `Failed to check campaign availability in isCampaignAvailable: ${error}`,
      );
    }
  };

  const onItemPressPrimary = useCallback(
    async (item: NamiCampaign) => {
      if (await isCampaignAvailable(item.value)) {
        // Direct launch without context
        await (item.type === 'label'
          ? triggerLaunch(item.value, null)
          : triggerLaunch(null, item.value));
      }
    },
    [triggerLaunch],
  );

  const onDetailPress = useCallback(
    async (item: NamiCampaign) => {
      if (await isCampaignAvailable(item.value)) {
        // Show launch context modal for configuration
        setSelectedCampaign(item);
        setShowLaunchContext(true);
      }
    },
    [],
  );

  const handleLaunchWithContext = useCallback(
    async (context: LaunchContextResult) => {
      if (!selectedCampaign) return;

      setShowLaunchContext(false);

      await (selectedCampaign.type === 'label'
        ? triggerLaunch(selectedCampaign.value, null, context)
        : triggerLaunch(null, selectedCampaign.value, context));

      setSelectedCampaign(null);
    },
    [selectedCampaign, triggerLaunch],
  );

  const onRefreshPress = useCallback(() => {
    getAllCampaigns();
    setRefresh(!refresh);
    getRefreshedCampaigns();
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
            getRefreshedCampaigns();
          }}
        />
      ),
      headerLeft: () => <HeaderLeft onButtonPress={onButtonPress} />,
    });
  }, [
    navigation,
    onRefreshPress,
    onButtonPress,
    getAllCampaigns,
    getRefreshedCampaigns,
    refresh,
  ]);

  const renderItem = ({ item, index }: {item: NamiCampaign; index: number}) => {
    const lasItem = index === campaigns.length - 1;
    const itemStyle = lasItem ? [styles.item, styles.lastItem] : styles.item;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          testID={`list_item_${item.value}`}
          accessibilityValue={{ text: JSON.stringify(item) }}
          onPress={() => onItemPressPrimary(item)}
          style={[itemStyle, styles.itemTouchable]}
        >
          <View
            testID={`list_item_view_${item.value}`}
            accessibilityValue={{ text: JSON.stringify(item) }}
            style={styles.viewContainer}
          >
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>{item.value}</Text>
              {item.type === NamiCampaignRuleType.URL && (
                <Text style={styles.itemText}>Open as: {item.type}</Text>
              )}
            </View>
            {hasLaunchContextConfig && (
              <TouchableOpacity
                testID={`detail_button_${item.value}`}
                onPress={(e) => {
                  e.stopPropagation();
                  onDetailPress(item);
                }}
                style={styles.inlinEditButton}
              >
                <Text style={styles.inlineEditIcon}>✎</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const SeparatorComponent = () => <View style={styles.separator} />;

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
      <View
        accessible={true}
        testID="campaign_screen">
        <Text
          testID="campaigns_title"
          style={styles.title}>
          Placements
        </Text>
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
        <Text style={styles.sectionHeader}>LIVE PLACEMENTS</Text>
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

      {/* Launch Context Modal */}
      <Modal
        visible={showLaunchContext}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowLaunchContext(false);
          setSelectedCampaign(null);
        }}
      >
        {selectedCampaign && (
          <DynamicLaunchContextView
            campaignLabel={selectedCampaign.type === 'label' ? selectedCampaign.value : undefined}
            campaignName={selectedCampaign.value}
            onLaunchWithContext={handleLaunchWithContext}
            onClose={() => {
              setShowLaunchContext(false);
              setSelectedCampaign(null);
            }}
          />
        )}
      </Modal>
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTouchable: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  inlinEditButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineEditIcon: {
    fontSize: 18,
    color: '#007AFF',
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
  headerButtonLeft: {
    marginLeft: 15,
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
