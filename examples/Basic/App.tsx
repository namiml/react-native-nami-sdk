import React, { useEffect, useState } from 'react';
import { Linking, Platform, EmitterSubscription, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NamiPaywallManager, NamiSKU } from 'react-native-nami-sdk';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import CustomerManagerScreen from './containers/CustomerManagerScreen';
import { handleDeepLink } from './services/deeplinking';
import { useNamiFlowListener } from './hooks/useNamiFlowListener';
import { LogBox } from 'react-native';

import {
  finishTransaction,
  getProducts,
  getSubscriptions,
  Product,
  ProductPurchase,
  PurchaseError,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  requestSubscription,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';

LogBox.ignoreLogs([
  'Billing is unavailable',
]);

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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [namiSku, setNamiSku] = useState<NamiSKU>(undefined);

  useNamiFlowListener();

  useEffect(() => {
    const subscription = Linking.addListener('url', handleDeepLink);

    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    async function startBuySubscription(skuId: string) {
      await requestSubscription({ sku: skuId });
    }

    async function startBuyOneTime(skuId: string) {
      await requestPurchase({ sku: skuId });
    }

    const purchaseUpdate: EmitterSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt
          ? purchase.transactionReceipt
          : (purchase as unknown as {originalJson: string}).originalJson;

        if (receipt) {
          try {
            await finishTransaction({ purchase });
            let price = '';
            let currency = '';

            console.log(subscriptions);
            console.log(JSON.stringify(purchase));

            if (purchase as SubscriptionPurchase) {
              const subscriptionProduct: Subscription = subscriptions[0];
              price = subscriptionProduct.price;
              currency = subscriptionProduct.currency;
            } else {
              const oneTimeProduct: Product = products[0];
              price = oneTimeProduct.price;
              currency = oneTimeProduct.currency;
            }

            if (Platform.OS === 'ios' || Platform.isTV) {
              console.log('Preparing to call buySkuCompleteApple');

              console.log(namiSku);
              console.log(purchase.transactionId);
              console.log(purchase.originalTransactionIdentifierIOS);

              NamiPaywallManager.buySkuComplete({
                product: namiSku,
                transactionID: purchase.transactionId ?? '',
                originalTransactionID:
                  purchase.originalTransactionIdentifierIOS ??
                  purchase.transactionId ??
                  '',
                price: price,
                currencyCode: currency,
                storeType: 'Apple',
              });
            } else if (Platform.OS === 'android') {
              if (Platform.constants.Manufacturer === 'Amazon') {
                console.log('Preparing to call buySkuCompleteAmazon');
                NamiPaywallManager.buySkuComplete({
                  product: namiSku,
                  receiptId: purchase.transactionId ?? '',
                  localizedPrice: price,
                  userId: purchase.userIdAmazon ?? '',
                  marketplace: purchase.userMarketplaceAmazon ?? '',
                  storeType: 'Amazon',
                });
              } else {
                console.log('Preparing to call buySkuCompleteGooglePlay');
                NamiPaywallManager.buySkuComplete({
                  product: namiSku,
                  purchaseToken: purchase.purchaseToken ?? '',
                  orderId: purchase.transactionId ?? '',
                  storeType: 'GooglePlay',
                });
              }
            }
          } catch (error) {
            console.log({ message: 'finishTransaction', error });
          }
        }
      },
    );

    const purchaseError: EmitterSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchase error', JSON.stringify(error));
        NamiPaywallManager.buySkuCancel();
      },
    );

    const buySkuListener = NamiPaywallManager.registerBuySkuHandler(
      async (sku: NamiSKU) => {
        console.log(
          'buy sku handler - need to start purchase flow for sku:',
          sku.skuId,
          sku.promoId || 'no promoId',
          sku.promoToken || 'no promoToken',
        );

        setNamiSku(sku);

        if (sku.type == 'subscription') {
          try {
            const subscriptions = await getSubscriptions({
              skus: [sku.skuId],
            });
            console.log(JSON.stringify(subscriptions));
            setSubscriptions(subscriptions);
          } catch (error) {
            console.log({ message: 'getSubscriptions', error });
          }
          startBuySubscription(sku.skuId);
        } else {
          try {
            const products = await getProducts({
              skus: [sku.skuId],
            });
            console.log(JSON.stringify(products));
            setProducts(products);
          } catch (error) {
            console.log({ message: 'getProducts', error });
          }
          startBuyOneTime(sku.skuId);
        }
      },
    );

    return () => {
      buySkuListener;
      purchaseUpdate;
      purchaseError;
    };
  }, [subscriptions, products, namiSku]);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={UNTITLED_HEADER_OPTIONS}>
        <Tab.Screen
          name="Campaign"
          component={CampaignScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                testID="campaign_tab" />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                testID="profile_tab" />
            ),
          }}
        />
        <Tab.Screen
          name="Entitlements"
          component={EntitlementsScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                testID="entitlements_tab" />
            ),
          }}
        />
        <Tab.Screen
          name="CustomerManager"
          component={CustomerManagerScreen}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                testID="customer_manager_tab" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
