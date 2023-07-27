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
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NamiCustomerManager, CustomerJourneyState} from 'react-native-nami-sdk';
import {ViewerTabProps} from '../App';

import theme from '../theme';

const Dot = (props: {value?: boolean; testId?: string}) => {
  return (
    <View
      testID={props.testId}
      accessibilityValue={{text: `${props.value}`}}
      style={[styles.cir, props.value && styles.active]}
    />
  );
};

interface ProfileScreenProps extends ViewerTabProps<'Profile'> {}

const ProfileScreen: FC<ProfileScreenProps> = ({navigation}) => {
  const [journeyState, setJourneyState] = useState<
    CustomerJourneyState | undefined
  >(undefined);
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | undefined>(undefined);
  const [displayedDeviceId, setDisplayedDeviceId] = useState<string>('');

  const checkIsLoggedIn = useCallback(() => {
    // workaround for tests purposes
    NamiCustomerManager.isLoggedIn().then(() =>
      setTimeout(() => {
        NamiCustomerManager.isLoggedIn().then((isLogin) => {
          setIsUserLogin(isLogin);
        });
      }, 500),
    );
  }, []);

  const onLoginPress = useCallback(() => {
    NamiCustomerManager.login('E97EDA7D-F1BC-48E1-8DF4-F67EF4A4E4FF');
    checkIsLoggedIn();
  }, [checkIsLoggedIn]);

  const onLogoutPress = useCallback(() => {
    NamiCustomerManager.logout();
    checkIsLoggedIn();
  }, [checkIsLoggedIn]);

  const getJourneyState = () => {
    NamiCustomerManager.journeyState().then((myJourneyState) => {
      console.log('myJourneyState', myJourneyState);
      setJourneyState(myJourneyState);
    });
  };

  const checkId = useCallback(() => {
    if (isUserLogin) {
      NamiCustomerManager.loggedInId().then((loggedId) => {
        setExternalId(loggedId);
      });
    } else {
      NamiCustomerManager.deviceId().then((deviceId) => {
        setDisplayedDeviceId(deviceId);
      });
    }
  }, [isUserLogin]);

  useEffect(() => {
    checkIsLoggedIn();
    getJourneyState();
    checkId();
    const subscriptionJourneyStateRemover =
      NamiCustomerManager.registerJourneyStateHandler((newJourneyState) => {
        console.log('newJourneyState', newJourneyState);
        setJourneyState(newJourneyState);
      });
    const subscriptionAccountStateRemover =
      NamiCustomerManager.registerAccountStateHandler(
        (action, success, error) => {
          console.log('accountState', action, success, error);
          if (action === 'login' && success) {
            setIsUserLogin(success);
            checkId();
          }
          if (action === 'login' && !success && error === 400) {
            onLogoutPress();
            onLoginPress();
          }
          if (action === 'logout' && success) {
            setIsUserLogin(!success);
            checkId();
          }
          if (action === 'nami_device_id_set' && success) {
            checkId();
          }
          if (action === 'nami_device_id_cleared' && success) {
            checkId();
          }
        },
      );
    return () => {
      subscriptionJourneyStateRemover();
      subscriptionAccountStateRemover();
    };
  }, [checkId, checkIsLoggedIn, onLoginPress, onLogoutPress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            testID="login_btn"
            style={styles.headerButton}
            onPress={isUserLogin ? onLogoutPress : onLoginPress}>
            <Text testID="login_btn_text" style={styles.headerButtonText}>
              {isUserLogin ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, isUserLogin, onLogoutPress, onLoginPress]);

  return (
    <SafeAreaView style={styles.container}>
      <Text testID="profile_title" style={styles.title}>
        Profile
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>
          {isUserLogin ? 'REGISTERED_USER' : 'ANONYMOUS USER'}
        </Text>
        <View style={styles.idSection}>
          <Text testID="user_id" style={styles.idLabel}>
            {isUserLogin ? 'Customer Id' : 'Device Id'}
          </Text>
          <Text style={styles.id}>
            {isUserLogin ? externalId : displayedDeviceId}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>JORNEY STATE</Text>
        <View style={styles.block}>
          <View style={styles.item}>
            <Dot
              testId="trial_period_dot"
              value={journeyState?.inTrialPeriod}
            />
            <Text style={styles.itemText}>In Trial Period</Text>
          </View>
          <View style={styles.item}>
            <Dot
              testId="offer_period_dot"
              value={journeyState?.inIntroOfferPeriod}
            />
            <Text style={styles.itemText}>In Intro Offer Period</Text>
          </View>
          <View style={styles.item}>
            <Dot testId="cancelled_dot" value={journeyState?.isCancelled} />
            <Text style={styles.itemText}>Has Cancelled</Text>
          </View>
          <View style={styles.item}>
            <Dot
              testId="subscriber_dot"
              value={journeyState?.formerSubscriber}
            />
            <Text style={styles.itemText}>Former Subscriber</Text>
          </View>
          <View style={styles.item}>
            <Dot
              testId="grace_period_dot"
              value={journeyState?.inGracePeriod}
            />
            <Text style={styles.itemText}>In Grace Period</Text>
          </View>
          <View style={styles.item}>
            <Dot
              testId="account_hold_dot"
              value={journeyState?.inAccountHold}
            />
            <Text style={styles.itemText}>In Account Hold</Text>
          </View>
          <View style={styles.item}>
            <Dot testId="pause_dot" value={journeyState?.inPause} />
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
  idSection: {
    backgroundColor: theme.white,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  id: {
    color: theme.links,
  },
  idLabel: {
    color: theme.secondaryFont,
    fontSize: 12,
    marginRight: 10,
  },
});

export default ProfileScreen;
