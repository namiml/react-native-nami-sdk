import React, {FC, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import {ViewerTabProps} from '../App';

import theme from '../theme';

const Dot = (props: {value?: boolean}) => {
  return <View style={[styles.cir, props.value && styles.active]} />;
};

interface ProfileScreenProps extends ViewerTabProps<'Profile'> {}

const ProfileScreen: FC<ProfileScreenProps> = ({navigation}) => {
  const [journeyState, setJourneyState] = useState(undefined);
  const {RNNamiCustomerManager} = NativeModules;
  const onLoginPress = () => {
    // RNNamiCustomerManager.login('f1851c87-e0ff-4349-a824-cd9b5e5211b9');
  };

  const getJourneyState = async () => {
    const myJourneyState = await RNNamiCustomerManager.journeyState();
    console.log('journeyState', journeyState);
    setJourneyState(myJourneyState);
  };

  const checkIsLoggedIn = async () => {
    const isLoggedIn = await RNNamiCustomerManager.isLoggedIn();
    console.log('isLoggedIn', isLoggedIn);
  };

  useEffect(() => {
    checkIsLoggedIn();
    getJourneyState();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity style={styles.headerButton} onPress={onLoginPress}>
            <Text style={styles.headerButtonText}>Login</Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>ANONYMOUS USER</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>JORNEY STATE</Text>
        <View style={styles.block}>
          <View style={styles.item}>
            <Dot value={journeyState?.inTrialPeriod} />
            <Text style={styles.itemText}>In Trial Period</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.inIntroOfferPeriod} />
            <Text style={styles.itemText}>In Intro Offer Period</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.isCancelled} />
            <Text style={styles.itemText}>Has Cancelled</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.formerSubscriber} />
            <Text style={styles.itemText}>Former Subscriber</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.inGracePeriod} />
            <Text style={styles.itemText}>In Grace Period</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.inAccountHold} />
            <Text style={styles.itemText}>In Acount Hold</Text>
          </View>
          <View style={styles.item}>
            <Dot value={journeyState?.inPause} />
            <Text style={styles.itemText}>In Pause</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {},
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
  block: {
    backgroundColor: theme.white,
    borderRadius: 8,
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
  cir: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.secondaryFont,
    marginRight: 10,
  },
  active: {
    backgroundColor: 'green',
  },
});

export default ProfileScreen;
