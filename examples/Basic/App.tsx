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
import {Platform, View} from 'react-native';

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
  useEffect(() => {
    // const registerPurchasesChangedRemover =
    //   NamiPurchaseManager.registerPurchasesChangedHandler(() => {});

    // const registerRestorePurchasesRemover =
    //   NamiPurchaseManager.registerRestorePurchasesHandler(() => {});

    let configDict = {
      'appPlatformID-apple': '002e2c49-7f66-4d22-a05c-1dc9f2b7f2af',
      'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
      // appPlatformId:
      //   Platform.OS === 'ios'
      //     ? '002e2c49-7f66-4d22-a05c-1dc9f2b7f2af'
      //     : '3d062066-9d3c-430e-935d-855e2c56dd8e',
      logLevel: 'DEBUG',
      developmentMode: false,
      bypassStore: false,
    };
    Nami.configure(configDict);
    // NamiPurchaseManager.clearBypassStorePurchases();
    NamiCustomerManager.logout();
    return () => {
      // registerPurchasesChangedRemover();
      // registerRestorePurchasesRemover();
    };
  }, []);

  // return <View style={{flex: 1, backgroundColor: 'red'}} />;

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
