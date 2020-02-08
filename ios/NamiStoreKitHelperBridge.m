//
//  NamiStorekitHelperBridge.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface NamiStoreKitHelper (RCTExternModule) <RCTBridgeModule>
 @end

@implementation NamiStoreKitHelper (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(NamiStoreKitHelper, NamiStoreKitHelper)


RCT_EXTERN_METHOD(clearBypassStoreKitPurchases)
_RCT_EXTERN_REMAP_METHOD(sharedInstance,shared,YES)


+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end


@interface NamiStoreKitHelperBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiStoreKitHelperBridge (RCTExternModule)

RCT_EXTERN_METHOD(sharedInstance)
- (NamiStoreKitHelper *)sharedInstance {
  return [NamiStoreKitHelper shared];
}

RCT_EXTERN_METHOD(clearBypassStoreKitPurchases)
- (void)clearBypassStoreKitPurchases {
  [[NamiStoreKitHelper shared] clearBypassStoreKitPurchases];
}

RCT_EXTERN_METHOD(bypassStoreKit:(BOOL)bypass)
- (void)bypassStoreKit: (BOOL) bypass {
  [[NamiStoreKitHelper shared] bypassStoreKitWithBypass:bypass];
}

RCT_EXPORT_METHOD(allPurchasedProducts:(RCTResponseSenderBlock)completion)
{
    NSArray <NamiMetaPurchase *> *purchases = [[NamiStoreKitHelper shared] allPurchasedProducts];
    NSLog(@"From SDK, purchases are currently %@", purchases);
    NSMutableArray *convertedPurchaseDicts = [NSMutableArray new];
    BOOL anyProductNil = NO;
    for ( NamiMetaPurchase *purchaseRecord in purchases ) {
        if ( purchaseRecord.metaProduct == nil ) {
            anyProductNil = YES;
        }
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
        [convertedPurchaseDicts addObject:purchaseDict];
    }
    
    completion(@[convertedPurchaseDicts]);
}

RCT_EXPORT_METHOD(anyProductPurchased:(nonnull NSArray*)productIDs completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [[NamiStoreKitHelper shared] anyProductPurchased:productIDs];
    completion(@[[NSNumber numberWithBool:active]]);
}

RCT_EXPORT_METHOD(buyProduct:(nonnull NSString*)productID completion:(RCTResponseSenderBlock)completion)
{
    [[NamiStoreKitHelper shared] productsForProductIdentifersWithProductIDs:@[productID] productHandler:^(BOOL success, NSArray<NamiMetaProduct *> * _Nullable products, NSArray<NSString *> * _Nullable invalidProducts, NSError * _Nullable error) {
        NSLog(@"Products found are %@, product fetch error is %@", products, [error localizedDescription]);
        NamiMetaProduct *useProduct = products.firstObject;
        if (useProduct != nil) {
            [[NamiStoreKitHelper shared] buyProduct:useProduct fromPaywall:nil responseHandler:^(NSArray<NamiMetaPurchase *> * _Nonnull purchase, NamiPurchaseState purchaseState, NSError * _Nullable error) {
                NSLog(@"Purchase result is %@, purchased is %d, error is %@", purchase, (purchaseState == NamiPurchaseStatePurchased), [error localizedDescription]);
                if (purchaseState == NamiPurchaseStatePurchased) {
                    completion(@[[NSNumber numberWithBool:true]]);
                }
            }];
        } else {
            completion(@[[NSNumber numberWithBool:false]]);
        }
    }];
}

@end

@implementation NamiStoreKitHelperBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiStoreKitHelperBridge, NamiStoreKitHelperBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
