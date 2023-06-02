import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NamiPaywallManager} from 'react-native-nami-sdk';

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
    const buySkuSubscription = NamiPaywallManager.registerBuySkuHandler(
      (sku) => {
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
      },
    );
    return () => {
      buySkuSubscription();
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
