import React, { useEffect } from 'react';
import { Linking, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NamiCustomerManager } from 'react-native-nami-sdk';
import { NamiPaywallManager } from 'react-native-nami-sdk';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import CustomerManagerScreen from './containers/CustomerManagerScreen';
import { handleDeepLink } from './services/deeplinking';

export const UNTITLED_HEADER_OPTIONS = {
  title: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: 'transparent' },
};

type ViewerTabNavigatorParams = {
  Campaign: undefined;
  Profile: undefined;
  Entitlements: undefined;
  CustomerManager: undefined;
};

export interface ViewerTabProps<
  RouteParam extends keyof ViewerTabNavigatorParams,
> {
  navigation: NativeStackNavigationProp<ViewerTabNavigatorParams, RouteParam>;
}

const Tab = createBottomTabNavigator<ViewerTabNavigatorParams>();

const App = () => {
  useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      linkingEvent.remove();
    };
  }, []);

  useEffect(() => {
    NamiPaywallManager.registerBuySkuHandler(sku => {
      console.log(
        'buy sku handler - need to start purchase flow for sku:',
        sku.skuId,
      );

      NamiPaywallManager.dismiss(true);

      if (Platform.OS === 'ios' || Platform.isTVOS) {
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
      } else if (Platform.OS === 'android') {
        if (Platform.constants.Manufacturer === 'Amazon') {
          NamiPaywallManager.buySkuCompleteAmazon({
            product: sku,
            purchaseDate: 1684823428,
            purchaseSource: 'CAMPAIGN',
            receiptId: '12345',
            localizedPrice: '120',
            userId: '12345',
            marketplace: '12345',
          });
        } else {
          NamiPaywallManager.buySkuCompleteGooglePlay({
            product: sku,
            purchaseDate: 1684823428,
            purchaseSource: 'CAMPAIGN',
            purchaseToken:
              'jolbnkpmojnpnjecgmphbmkc.AO-J1OznE4AIzyUvKFe1RSVkxw4KEtv0WfyL_tkzozOqnlSvIPsyQJBphCN80gwIMaex4EMII95rFCZhMCbVPZDc-y_VVhQU5Ddua1dLn8zV7ms_tdwoDmE',
            orderId: 'GPA.3317-0284-9993-42221',
          });
        }
      }
    });

    NamiCustomerManager.setCustomerDataPlatformId('2135');
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={UNTITLED_HEADER_OPTIONS}>
        <Tab.Screen
          options={{ tabBarTestID: 'campaign_screen' }}
          name="Campaign"
          component={CampaignScreen}
        />
        <Tab.Screen
          options={{ tabBarTestID: 'profile_screen' }}
          name="Profile"
          component={ProfileScreen}
        />
        <Tab.Screen
          options={{ tabBarTestID: 'entitlements_screen' }}
          name="Entitlements"
          component={EntitlementsScreen}
        />
        <Tab.Screen
          options={{ tabBarTestID: 'customer_manager_screen' }}
          name="CustomerManager"
          component={CustomerManagerScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
