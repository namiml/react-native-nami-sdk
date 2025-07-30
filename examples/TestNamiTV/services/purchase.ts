// services/purchase.ts
import {
  isIosStorekit2,
  finishTransaction,
  getProducts,
  getSubscriptions,
  requestPurchase,
  requestSubscription,
  Product,
  ProductPurchase,
  Subscription,
  SubscriptionPurchase,
  SubscriptionOfferDetails,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { NamiPaywallManager, NamiCustomerManager, NamiSKU } from 'react-native-nami-sdk';

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

      console.log('[startSkuPurchase] Requesting subscription for:', sku.skuId, 'with token:', sku.promoToken);

      if (Platform.OS === 'android' && sku.promoToken) {
        console.log('[startSkuPurchase] Requesting subscription for:', sku.skuId, 'with token:', sku.promoToken);


        const androidSub = subs[0] as SubscriptionOfferDetails;
        const offerToken = sku.promoToken ?? androidSub.subscriptionOffers?.[0]?.offerToken;

        await requestSubscription({
          sku: sku.skuId,
          subscriptionOffers: [{ sku: sku.skuId, offerToken }],
        });
      } else {
        if (Platform.OS === 'ios' && sku.promoId && sku.promoOffer) {
          console.log('[startSkuPurchase] Found promo offer for subscription:', sku.skuId, 'promo id:', sku.promoId, 'promo offer:', sku.promoOffer);
          console.log('storekit2 mode? ', isIosStorekit2());

          const applePromoOffer = sku.promoOffer;
          const loginId = await NamiCustomerManager.loggedInId();

          const request: any = {
            sku: sku.skuId,
            appAccountToken: loginId,
            withOffer: {
              identifier: sku.promoId,
              keyIdentifier: applePromoOffer.key_id,
              nonce: applePromoOffer.nonce,
              signature: applePromoOffer.signature,
              timestamp: Number(applePromoOffer.timestamp),
            } };


          console.log('subscription request ', request);

          await requestSubscription(request);
        } else {
          const request: any = { sku: sku.skuId };
          await requestSubscription(request);
        }
      }
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
