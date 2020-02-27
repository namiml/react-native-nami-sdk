package com.reactnativenamisdk

import com.facebook.react.ReactPackage
import android.util.Log
import com.facebook.react.bridge.*

class NamiStoreKitHelperBridge : NativeModule {

    @ReactMethod
    public fun clearBypassStoreKitPurchases()  {
//        return [NamiStoreKitHelper shared];
    }

    @ReactMethod
    public fun bypassStoreKit(bypass: Boolean?) {
//        [[NamiStoreKitHelper shared] bypassStoreKitWithBypass:bypass];

    }

    @ReactMethod
    public fun allPurchasedProducts(p: Promise)  {
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

    @ReactMethod
    public fun anyProductPurchased(productIDs: String, p: Promise)  {
//        BOOL active = [[NamiStoreKitHelper shared] anyProductPurchased:productIDs];
//        completion(@[[NSNumber numberWithBool:active]]);

        // Find if any of the proeucts in the array have been purcahsed
        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }

    @ReactMethod
    public fun buyProduct(productID: String, p: Promise)  {

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

    override fun onCatalystInstanceDestroy() {
    }

    override fun getName(): String {
        return "NamiStoreKitHelperBridge"
    }

    override fun canOverrideExistingModule(): Boolean {
        return false
    }

    override fun initialize() {
    }

}