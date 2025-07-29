// services/purchase.ts
import {
  finishTransaction,
  getProducts,
  getSubscriptions,
  requestPurchase,
  requestSubscription,
  Product,
  ProductPurchase,
  Subscription,
  SubscriptionPurchase,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { NamiPaywallManager, NamiSKU } from 'react-native-nami-sdk';

export async function startSkuPurchase(
  sku: NamiSKU,
  setProducts: (products: Product[]) => void,
  setSubscriptions: (subscriptions: Subscription[]) => void,
  setNamiSku: (sku: NamiSKU) => void,
) {
  setNamiSku(sku);

  try {
    if (sku.type === 'subscription') {
      const subs = await getSubscriptions({ skus: [sku.skuId] });
      setSubscriptions(subs);
      await requestSubscription({ sku: sku.skuId });
    } else {
      const prods = await getProducts({ skus: [sku.skuId] });
      setProducts(prods);
      await requestPurchase({ sku: sku.skuId });
    }
  } catch (error) {
    console.warn('[startSkuPurchase] Error starting purchase', error);
    NamiPaywallManager.buySkuCancel();
  }
}

export async function handlePurchaseUpdate(
  purchase: ProductPurchase | SubscriptionPurchase,
  sku: NamiSKU | undefined,
  products: Product[],
  subscriptions: Subscription[],
) {
  const receipt = purchase.transactionReceipt ?? (purchase as any)?.originalJson;
  if (!receipt || !sku) return;

  try {
    await finishTransaction({ purchase });

    const product = subscriptions[0] ?? products[0];
    const price = product?.price ?? '';
    const currency = product?.currency ?? '';

    if (Platform.OS === 'ios' || Platform.isTV) {
      NamiPaywallManager.buySkuComplete({
        product: sku,
        transactionID: purchase.transactionId ?? '',
        originalTransactionID:
          purchase.originalTransactionIdentifierIOS ?? purchase.transactionId ?? '',
        price,
        currencyCode: currency,
        storeType: 'Apple',
      });
    } else if (Platform.OS === 'android') {
      if (Platform.constants.Manufacturer === 'Amazon') {
        NamiPaywallManager.buySkuComplete({
          product: sku,
          receiptId: purchase.transactionId ?? '',
          localizedPrice: price,
          userId: (purchase as any).userIdAmazon ?? '',
          marketplace: (purchase as any).userMarketplaceAmazon ?? '',
          storeType: 'Amazon',
        });
      } else {
        NamiPaywallManager.buySkuComplete({
          product: sku,
          purchaseToken: purchase.purchaseToken ?? '',
          orderId: purchase.transactionId ?? '',
          storeType: 'GooglePlay',
        });
      }
    }
  } catch (error) {
    console.warn('[handlePurchaseUpdate] Error finishing transaction:', error);
  }
}
