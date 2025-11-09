import React, { useEffect, useRef, useState } from 'react';
import {
  Linking,
  LogBox,
} from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NamiPaywallManager, NamiSKU } from 'react-native-nami-sdk';
import {
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
  ProductPurchase,
  SubscriptionPurchase,
  setup
} from 'react-native-iap';

import {
  startSkuPurchase,
  handlePurchaseUpdate,
} from './services/purchase';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import CustomerManagerScreen from './containers/CustomerManagerScreen';
import { SignInScreen } from './containers/SignInScreen';
import { useNamiFlowListener } from './hooks/useNamiFlowListener';
import { handleDeepLink } from './services/deeplinking';

LogBox.ignoreLogs(['Billing is unavailable']);
setup({ storekitMode: 'STOREKIT2_MODE' });

const UNTITLED_HEADER_OPTIONS = {
  title: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: 'transparent' },
};

// --- Navigation setup ---

type RootStackParamList = {
  MainTabs: undefined;
  SignIn: undefined;
};

type ViewerTabNavigatorParams = {
  Campaign: undefined;
  Profile: undefined;
  Entitlements: undefined;
  CustomerManager: undefined;
};

export type RootStackNav = NativeStackNavigationProp<RootStackParamList>;
export type ViewerTabNav<Route extends keyof ViewerTabNavigatorParams> =
  NativeStackNavigationProp<ViewerTabNavigatorParams, Route>;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<ViewerTabNavigatorParams>();

// --- Tabs Navigator ---

const Tabs = () => (
  <Tab.Navigator screenOptions={UNTITLED_HEADER_OPTIONS}>
    <Tab.Screen
      name="Campaign"
      component={CampaignScreen}
      options={{
        title: 'Campaigns',
        tabBarTestID: 'campaign_tab',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        title: 'Profile',
        tabBarTestID: 'profile_tab',
      }}
    />
    <Tab.Screen
      name="Entitlements"
      component={EntitlementsScreen}
      options={{
        title: 'Entitlements',
        tabBarTestID: 'entitlements_tab',
      }}
    />
    <Tab.Screen
      name="CustomerManager"
      component={CustomerManagerScreen}
      options={{
        title: 'Customer',
        tabBarTestID: 'customer_manager_tab',
      }}
    />
  </Tab.Navigator>
);

// --- Main App Component ---

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [namiSku, setNamiSku] = useState<NamiSKU | undefined>(undefined);

  // Nami Flow handoffs (Sign In, Push, etc.)
  useNamiFlowListener(
    navigationRef,
    setProducts,
    setSubscriptions,
    setNamiSku
  );

  // Deeplink setup
  useEffect(() => {
    const subscription = Linking.addListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => url && handleDeepLink({ url }));
    return () => subscription.remove();
  }, []);

  // IAP purchase handling
  useEffect(() => {
    const buySkuListener = NamiPaywallManager.registerBuySkuHandler(
      async (sku: NamiSKU) => {
        await startSkuPurchase(sku, setProducts, setSubscriptions, setNamiSku);
      }
    );

    const purchaseUpdate = purchaseUpdatedListener(async (purchase: ProductPurchase | SubscriptionPurchase) => {
      await handlePurchaseUpdate(purchase, namiSku, products, subscriptions);
    });

    const purchaseError = purchaseErrorListener((error: PurchaseError) => {
      console.log('[purchase error]', error);
      NamiPaywallManager.buySkuCancel();
    });

    return () => {
      buySkuListener;
      purchaseUpdate.remove();
      purchaseError.remove();
    };
  }, [subscriptions, products, namiSku]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={Tabs} />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ presentation: 'modal' }} // ← makes it modal
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
