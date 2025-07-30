import React, { useEffect, useState } from 'react';
import { Linking, TouchableOpacity, LogBox } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NamiPaywallManager, NamiFlowManager, NamiSKU } from 'react-native-nami-sdk';
import {
  purchaseUpdatedListener,
  purchaseErrorListener,
  PurchaseError,
  ProductPurchase,
  SubscriptionPurchase,
  Product,
  Subscription,
} from 'react-native-iap';

import { startSkuPurchase, handlePurchaseUpdate } from './services/purchase';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import { SignInScreen } from './containers/SignInScreen';
import { useNamiFlowListener } from './hooks/useNamiFlowListener';
import { handleDeepLink } from './services/deeplinking';

LogBox.ignoreLogs(['Billing is unavailable']);

export const UNTITLED_HEADER_OPTIONS = {
  title: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: 'transparent' },
};

type RootStackParamList = {
  MainTabs: undefined;
  SignIn: undefined;
};

type ViewerTabNavigatorParams = {
  Campaign: undefined;
  Profile: undefined;
  Entitlements: undefined;
};

export interface ViewerTabProps<RouteParam extends keyof ViewerTabNavigatorParams> {
  navigation: NativeStackNavigationProp<ViewerTabNavigatorParams, RouteParam>;
}

const Tab = createBottomTabNavigator<ViewerTabNavigatorParams>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Add this wrapper component
const TabButton = ({ testID, ...props }: any) => (
  <TouchableOpacity
    {...props}
    testID={testID}
    delayLongPress={props.delayLongPress || undefined} />
);

const Tabs = () => (
  <Tab.Navigator screenOptions={UNTITLED_HEADER_OPTIONS}>
    <Tab.Screen
      name="Campaign"
      component={CampaignScreen}
      options={{
        tabBarButton: props => <TabButton
          {...props}
          testID="campaign_tab" />
      }} />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarButton: props => <TabButton
          {...props}
          testID="profile_tab" />
      }} />
    <Tab.Screen
      name="Entitlements"
      component={EntitlementsScreen}
      options={{
        tabBarButton: props => <TabButton
          {...props}
          testID="entitlements_tab" />
      }} />
  </Tab.Navigator>
);

const App = () => {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [namiSku, setNamiSku] = useState<NamiSKU | undefined>(undefined);
  const [wasOnSignIn, setWasOnSignIn] = useState(false);

  useNamiFlowListener(navigationRef, setProducts, setSubscriptions, setNamiSku);

  useEffect(() => {
    const subscription = Linking.addListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => url && handleDeepLink({ url }));
    return () => subscription.remove();
  }, []);
  useEffect(() => {

    const unsubscribe = navigationRef.current?.addListener?.('state', () => {
      const currentRoute = navigationRef.current?.getCurrentRoute();
      if (!currentRoute) return;

      if (currentRoute.name === 'SignIn') {
        setWasOnSignIn(true);
      } else if (wasOnSignIn) {
        setWasOnSignIn(false);

        console.log('[App] SignIn dismissed');

        NamiFlowManager.resume();
        // setTimeout(() => {
        //   console.log('[App] SignIn dismissed, resuming Nami Flow');
        //   NamiFlowManager.resume();
        // }, 1000);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, [wasOnSignIn]);

  useEffect(() => {
    const buySkuListener = NamiPaywallManager.registerBuySkuHandler(async (sku: NamiSKU) => {
      await startSkuPurchase(sku, setProducts, setSubscriptions, setNamiSku);
    });

    const purchaseUpdate = purchaseUpdatedListener(async (purchase: ProductPurchase | SubscriptionPurchase) => {
      await handlePurchaseUpdate(purchase, namiSku, products, subscriptions);
    });

    const purchaseError = purchaseErrorListener((error: PurchaseError) => {
      console.log('purchase error', JSON.stringify(error));
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
          options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
