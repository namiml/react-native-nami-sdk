import React, {FC, useEffect, useState} from 'react';
import {
  NativeModules,
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
} from 'react-native';

import theme from '../theme';

const {RNNamiCampaignManager} = NativeModules;

const CampaignScreen: FC<any> = (props) => {
  const [campaigns, setCampaigns] = useState([]);
  const checkIsCampaignAvailable = async () => {
    const isCampaignAvailable = await RNNamiCampaignManager.isCampaignAvailable(
      null,
    );
    console.log('isCampaignAvailable', isCampaignAvailable);
  };

  const getAllCampaigns = async () => {
    const allCampaigns = await RNNamiCampaignManager.allCampaigns();
    setCampaigns(allCampaigns);
    console.log('allCampaigns', allCampaigns);
  };

  useEffect(() => {
    RNNamiCampaignManager.launch();
    getAllCampaigns();
    checkIsCampaignAvailable();
  }, []);

  const renderCampaigns = ({item}) => {
    return (
      <View style={styles.item}>
        <Text>{item.value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList data={campaigns} renderItem={renderCampaigns} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: theme.lighter,
  },
});

export default CampaignScreen;
