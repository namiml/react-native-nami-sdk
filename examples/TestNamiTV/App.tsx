import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NamiCustomerManager} from 'react-native-nami-sdk';
import {NamiPaywallManager} from 'react-native-nami-sdk';
import NamiPurchaseSuccess from 'react-native-nami-sdk';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';

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

    console.log('OS detected is ', Platform.OS)

    NamiPaywallManager.registerBuySkuHandler(
    (sku) => {
      console.log('buy sku handler - need to start purchase flow for sku:', sku.skuId);

      NamiPaywallManager.dismiss(true);

      if (Platform.OS === "ios" || Platform.isTVOS) {

        NamiPaywallManager.buySkuCompleteApple({
          product: sku,
          transactionID: '12345',
          originalTransactionID: '12345',
          originalPurchaseDate: 1684823428,
          purchaseDate: 1684823428,
          price: '120',
          currencyCode: 'USD',
          locale: 'US',
        });

        }
    },
  );

    NamiCustomerManager.setCustomerDataPlatformId("2135");
    return () => {};
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
