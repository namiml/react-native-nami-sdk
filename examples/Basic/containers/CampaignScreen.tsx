import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {RNNamiCampaignManager} from 'react-native-nami-sdk';

import theme from '../theme';

const CampaignScreen: FC<any> = ({navigation}) => {
  const [campaigns, setCampaigns] = useState([]);
  const checkIsCampaignAvailable = async () => {
    const isCampaignAvailable = await RNNamiCampaignManager.isCampaignAvailable(
      null,
    );
  };

  const getAllCampaigns = async () => {
    const allCampaigns = await RNNamiCampaignManager.allCampaigns();
    setCampaigns(allCampaigns);
    console.log('allCampaigns', allCampaigns);
  };

  const onItemPress = (label?: string) => {
    RNNamiCampaignManager.launch(label);
  };

  const onRefreshPress = () => {
    RNNamiCampaignManager.refresh();
  };

  useEffect(() => {
    checkIsCampaignAvailable();
    getAllCampaigns();
  }, []);

  useEffect(() => {
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

  const renderCampaigns = ({item}) => {
    if (!item.value) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => onItemPress(item.value)}
        style={styles.item}>
        <Text style={styles.itemText}>{item.value}</Text>
      </TouchableOpacity>
    );
  };

  const renderDefault = () => {
    return (
      <TouchableOpacity onPress={() => onItemPress()} style={styles.item}>
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
        <FlatList data={campaigns} renderItem={renderCampaigns} />
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

export default CampaignScreen;
