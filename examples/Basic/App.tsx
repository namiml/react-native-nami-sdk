import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NamiCustomerManager,
  NamiPurchaseManager,
  Nami,
} from 'react-native-nami-sdk';
import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import {Platform} from 'react-native';

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
    const registerPurchasesChangedRemover =
      NamiPurchaseManager.registerPurchasesChangedHandler(() => {});

    const registerRestorePurchasesRemover =
      NamiPurchaseManager.registerRestorePurchasesHandler(() => {});

    let configDict = {
      'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
      'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
      // appPlatformId:
      //   Platform.OS === 'ios'
      //     ? '4a2f6dbf-e684-4d65-a4df-0488771c577d'
      //     : '3d062066-9d3c-430e-935d-855e2c56dd8e',
      logLevel: 'DEBUG',
      developmentMode: false,
      bypassStore: false,
      namiCommands: ['useStagingAPI'],
    };

    Nami.configure(configDict);
    NamiPurchaseManager.clearBypassStorePurchases();
    NamiCustomerManager.logout();
    return () => {
      registerPurchasesChangedRemover();
      registerRestorePurchasesRemover();
    };
  }, []);

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
