import type { NamiPurchase, NamiSKUType } from './types';

export function parsePurchaseDates(
  purchase: NamiPurchaseFromBridge,
): NamiPurchase {
  return {
    ...purchase,
    purchaseInitiatedTimestamp: new Date(purchase.purchaseInitiatedTimestamp),
    expires: purchase.expires ? new Date(purchase.expires) : undefined,
  };
}

const validSkuTypes: NamiSKUType[] = [
  'unknown',
  'one_time_purchase',
  'subscription',
];

export function coerceSkuType(raw: string): NamiSKUType {
  return validSkuTypes.includes(raw as NamiSKUType)
    ? (raw as NamiSKUType)
    : 'unknown';
}
