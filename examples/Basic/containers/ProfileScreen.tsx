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
import {
  NamiCustomerManager,
  CustomerJourneyState,
} from 'react-native-nami-sdk';
import { ViewerTabProps } from '../App';

import theme from '../theme';

const DOT_CONFIGS = [
  {
    id: 'trial_period_dot',
    property: 'inTrialPeriod',
    label: 'In Trial Period'
  },
  {
    id: 'offer_period_dot',
    property: 'inIntroOfferPeriod',
    label: 'In Intro Offer Period'
  },
  {
    id: 'cancelled_dot',
    property: 'isCancelled',
    label: 'Has Cancelled'
  },
  {
    id: 'subscriber_dot',
    property: 'formerSubscriber',
    label: 'Former Subscriber'
  },
  {
    id: 'grace_period_dot',
    property: 'inGracePeriod',
    label: 'In Grace Period'
  },
  {
    id: 'account_hold_dot',
    property: 'inAccountHold',
    label: 'In Account Hold'
  },
  {
    id: 'pause_dot',
    property: 'inPause',
    label: 'In Pause'
  },
];

const Dot = ({ isActive = false, testId } : { isActive?: boolean, testId?: string }) => (
  <View
    testID={testId}
    accessibilityValue={{ text: `${isActive}` }}
    style={[styles.cir, isActive && styles.active]}
  />
);

type ProfileScreenProps = ViewerTabProps<'Profile'>

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const [journeyState, setJourneyState] = useState<CustomerJourneyState | undefined>(undefined);
  const [isUserLogin, setIsUserLogin] = useState<boolean>(false);
  const [externalId, setExternalId] = useState<string | undefined>(undefined);
  const [displayedDeviceId, setDisplayedDeviceId] = useState<string>('');

  const onLoginPress = useCallback(() => {
    // b909a31c-7a73-11ed-a1eb-0242ac120002
    // f1851c87-e0ff-4349-a824-cd9b5e5211b9
    NamiCustomerManager.login(
      'E97EDA7D-F1BC-48E1-8DF4-F67EF4A4E4FF',
      (success, error) => {
        console.log('success', success);
        console.log('error', error);
      },
    );
  }, []);

  const onLogoutPress = useCallback(() => {
    NamiCustomerManager.logout((success, error) => {
      console.log('success', success);
      console.log('error', error);
    });
  }, []);

  const getJourneyState = useCallback(async () => {
    const myJourneyState = await NamiCustomerManager.journeyState();
    console.log('myJourneyState', myJourneyState);
    setJourneyState(myJourneyState);
  }, []);

  const checkIsLoggedIn = async () => {
    const isLoggedIn = await NamiCustomerManager.isLoggedIn();
    setIsUserLogin(isLoggedIn);
    console.log('isLoggedIn', isLoggedIn);
  };

  const checkId = async () => {
    const loggedId = await NamiCustomerManager.loggedInId();
    const deviceId = await NamiCustomerManager.deviceId();
    setExternalId(loggedId);
    setDisplayedDeviceId(deviceId);
  };

  useEffect(() => {
    checkIsLoggedIn();
    getJourneyState();
    checkId();
    const subscriptionJourneyStateRemover =
      NamiCustomerManager.registerJourneyStateHandler(newJourneyState => {
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
          if (action == 'nami_device_id_set' && success) {
            checkId();
          }
          if (action == 'nami_device_id_cleared' && success) {
            checkId();
          }
        },
      );
    return () => {
      subscriptionJourneyStateRemover();
      subscriptionAccountStateRemover();
    };
  }, [getJourneyState, onLoginPress, onLogoutPress]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={isUserLogin ? onLogoutPress : onLoginPress}>
            <Text
              testID="login_btn"
              style={styles.headerButtonText}>
              {isUserLogin ? 'Logout' : 'Login'}
            </Text>
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, isUserLogin, onLogoutPress, onLoginPress]);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        testID="profile_title"
        style={styles.title}>
        Profile
      </Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>
          {isUserLogin ? 'REGISTERED_USER' : 'ANONYMOUS USER'}
        </Text>
        <View style={styles.idSection}>
          <Text
            testID="user_id"
            style={styles.idLabel}>
            {isUserLogin ? 'External Id' : 'Device Id'}
          </Text>
          <Text style={styles.id}>
            {isUserLogin ? externalId : displayedDeviceId}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>JOURNEY STATE</Text>
        {journeyState && (
          <View style={styles.block}>
            {DOT_CONFIGS.map(({ id, property, label }) => (
              <View
                key={id}
                style={styles.item}>
                <Dot
                  testId={id}
                  isActive={journeyState?.[property]} />
                <Text style={styles.itemText}>{label}</Text>
              </View>
            ))}
          </View>
        )}
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
