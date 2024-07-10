import React, {
  FC,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NamiCampaignManager, NamiCampaign, NamiCampaignRuleType, NamiPaywallEvent } from 'react-native-nami-sdk';
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

const CampaignScreen: FC<CampaignScreenProps> = ({ navigation }) => {
  const [campaigns, setCampaigns] = useState<NamiCampaign[]>([]);

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

  const getAllCampaigns = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.allCampaigns();
    const validCampaigns = fetchedCampaigns.filter((campaign) =>
      Boolean(campaign.value),
    );
    setCampaigns(validCampaigns);
    console.log('validCampaigns', validCampaigns);
  }, []);

  const triggerLaunch = (label?: any, url?: any) => {
    return NamiCampaignManager.launch(
      label,
      url,
      undefined,
      (successAction, error) => {
        console.log('successAction', successAction);
        console.log('error', error);
      },
      (event: NamiPaywallEvent) => {
        console.log('event', event);
      },
    );
  };

  const isCampaignAvailable = async (value?: string | null | undefined) => {
    try {
      return await NamiCampaignManager.isCampaignAvailable(value ?? '');
    } catch (error) {
      console.error(
        `Failed to check campaign availability in isCampaignAvailable TVOS: ${error}`,
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

  const onRefreshPress = useCallback(async () => {
    const fetchedCampaigns = await NamiCampaignManager.refresh();
    const refreshedCampaigns = fetchedCampaigns.filter(campaign =>
      Boolean(campaign.value),
    );
    setCampaigns(refreshedCampaigns);
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
        onPress={() => onItemPressPrimary(item)}
        style={itemStyle}>
        <View style={styles.viewContainer}>
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
        onPress={() => onItemPressDefault()}
        style={styles.itemDef}>
        <Text style={styles.itemText}>default</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['right', 'bottom', 'left']}>
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
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CampaignScreen;
