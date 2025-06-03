import React, { useEffect, useState } from 'react';
import { Linking, Platform, EmitterSubscription } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NamiPaywallManager, NamiSKU, NamiFlowManager } from 'react-native-nami-sdk';

import CampaignScreen from './containers/CampaignScreen';
import ProfileScreen from './containers/ProfileScreen';
import EntitlementsScreen from './containers/EntitlementsScreen';
import CustomerManagerScreen from './containers/CustomerManagerScreen';
import { handleDeepLink } from './services/deeplinking';

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

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      Linking.removeAllListeners('url');
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
              const subscriptionProduct: Subscription = subscriptions[0]
              price = subscriptionProduct.price
              currency = subscriptionProduct.currency
            } else {
              const oneTimeProduct: Product = products[0]
              price = oneTimeProduct.price
              currency = oneTimeProduct.currency

            }

            if (Platform.OS === 'ios' || Platform.isTV) {
              console.log('Preparing to call buySkuCompleteApple');

              console.log(namiSku);
              console.log(purchase.transactionId);
              console.log(purchase.originalTransactionIdentifierIOS);

              NamiPaywallManager.buySkuCompleteApple({
                product: namiSku,
                transactionID: purchase.transactionId ?? '',
                originalTransactionID: purchase.originalTransactionIdentifierIOS ?? purchase.transactionId ?? '',
                price: price,
                currencyCode: currency,
              });
            } else if (Platform.OS === 'android') {
              if (Platform.constants.Manufacturer === 'Amazon') {
                console.log('Preparing to call buySkuCompleteAmazon');
                NamiPaywallManager.buySkuCompleteAmazon({
                  product: namiSku,
                  receiptId: purchase.transactionId ?? '',
                  localizedPrice: price,
                  userId: purchase.userIdAmazon ?? '',
                  marketplace: purchase.userMarketplaceAmazon ?? '',
                });
              } else {
                console.log('Preparing to call buySkuCompleteGooglePlay');
                NamiPaywallManager.buySkuCompleteGooglePlay({
                  product: namiSku,
                  purchaseToken: purchase.purchaseToken ?? '',
                  orderId: purchase.transactionId ?? '',
                });
              }
            }


          } catch (error) {
            console.log({ message: 'finishTransaction', error });
          }
        }
      },
    );

    const purchaseError: EmitterSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.log('purchase error', JSON.stringify(error));
      NamiPaywallManager.buySkuCancel();
    });

    const subscriptionRemover = NamiPaywallManager.registerBuySkuHandler(
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

    const subscriptionFlowRemover = NamiFlowManager.registerStepHandoff((tag, data) => {
        console.log('handoff tag:', tag, 'data:', data);
    });


    return () => {
      subscriptionRemover();
      subscriptionFlowRemover();
      purchaseUpdate;
      purchaseError;
    };
  }, [subscriptions, products, namiSku]);

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
