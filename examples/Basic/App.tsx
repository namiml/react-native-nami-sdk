import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NamiCustomerManager,
  // NamiPurchaseManager,
  Nami,
} from 'react-native-nami-sdk';
import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import {getConfigObject} from './config';

export const UNTITLED_HEADER_OPTIONS = {
  title: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: {backgroundColor: 'transparent'},
};

type ViewerTabNavigatorParams = {
  Campaign: undefined;
  Profile: undefined;
  Entitlements: undefined;
};

export interface ViewerTabProps<
  RouteParam extends keyof ViewerTabNavigatorParams,
> {
  navigation: NativeStackNavigationProp<ViewerTabNavigatorParams, RouteParam>;
}

const Tab = createBottomTabNavigator<ViewerTabNavigatorParams>();

const App = () => {
  const configDict = getConfigObject();
  console.log('configDict', configDict);
  useEffect(() => {
    // const registerPurchasesChangedRemover =
    //   NamiPurchaseManager.registerPurchasesChangedHandler(() => {});

    // const registerRestorePurchasesRemover =
    //   NamiPurchaseManager.registerRestorePurchasesHandler(() => {});
    Nami.configure(configDict);
    // NamiPurchaseManager.clearBypassStorePurchases();
    NamiCustomerManager.logout();
    return () => {
      // registerPurchasesChangedRemover();
      // registerRestorePurchasesRemover();
    };
  }, [configDict]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={UNTITLED_HEADER_OPTIONS}>
        <Tab.Screen name="Campaign" component={CampaignScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Entitlements" component={EntitlementsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
