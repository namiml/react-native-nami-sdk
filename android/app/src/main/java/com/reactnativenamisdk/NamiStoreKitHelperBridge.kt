package com.reactnativenamisdk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import android.util.Log

class NamiStoreKitHelperBridge : NativeModule {

    internal fun clearBypassStoreKitPurchases(): Void {
//        return [NamiStoreKitHelper shared];
    }


    internal fun bypassStoreKit(bypass: Boolean?): Void {
//        [[NamiStoreKitHelper shared] bypassStoreKitWithBypass:bypass];

    }

    internal fun allPurchasedProducts(p: Promise): Void {
//        NSArray <NamiMetaPurchase *> *purchases = [[NamiStoreKitHelper shared] allPurchasedProducts];
//        NSLog(@"From SDK, purchases are currently %@", purchases);
//        NSMutableArray *convertedPurchaseDicts = [NSMutableArray new];
//        BOOL anyProductNil = NO;
//        for ( NamiMetaPurchase *purchaseRecord in purchases ) {
//            if ( purchaseRecord.metaProduct == nil ) {
//                anyProductNil = YES;
//            }
//            NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
//            [convertedPurchaseDicts addObject:purchaseDict];
//        }

//        completion(@[convertedPurchaseDicts]);

        // returns purcahse dictionaries
        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }

    internal fun anyProductPurchased(productIDs: String, p: Promise): Void {
//        BOOL active = [[NamiStoreKitHelper shared] anyProductPurchased:productIDs];
//        completion(@[[NSNumber numberWithBool:active]]);

        // Find if any of the proeucts in the array have been purcahsed
        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }

    internal fun buyProduct(productID: String, p: Promise): Void {

//        [[NamiStoreKitHelper shared] productsForProductIdentifersWithProductIDs:@[productID] productHandler:^(BOOL success, NSArray<NamiMetaProduct *> * _Nullable products, NSArray<NSString *> * _Nullable invalidProducts, NSError * _Nullable error) {
//            NSLog(@"Products found are %@, product fetch error is %@", products, [error localizedDescription]);
//            NamiMetaProduct *useProduct = products.firstObject;
//            if (useProduct != nil) {
//                [[NamiStoreKitHelper shared] buyProduct:useProduct fromPaywall:nil responseHandler:^(NSArray<NamiMetaPurchase *> * _Nonnull purchase, NamiPurchaseState purchaseState, NSError * _Nullable error) {
//                    NSLog(@"Purchase result is %@, purchased is %d, error is %@", purchase, (purchaseState == NamiPurchaseStatePurchased), [error localizedDescription]);
//                    if (purchaseState == NamiPurchaseStatePurchased) {
//                        completion(@[[NSNumber numberWithBool:true]]);
//                    }
//                }];
//            } else {
//                completion(@[[NSNumber numberWithBool:false]]);
//            }
//        }];

        // Attempt to purchase a product
        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }

}