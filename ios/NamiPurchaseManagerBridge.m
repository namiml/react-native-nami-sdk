//
//  NamiPurchaseManagerBridge.m
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


@interface NamiPurchaseManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiPurchaseManagerBridge (RCTExternModule)


RCT_EXTERN_METHOD(clearBypassStorePurchases)
- (void)clearBypassStorePurchases {
  [NamiPurchaseManager clearBypassStorePurchases];
}

RCT_EXPORT_METHOD(purchases:(RCTResponseSenderBlock)completion)
{
    NSArray <NamiPurchase *> *purchases = [NamiPurchaseManager allPurchases];
    NSMutableArray *convertedPurchaseDicts = [NSMutableArray new];
    BOOL anyProductNil = NO;
    for ( NamiPurchase *purchaseRecord in purchases ) {
        if ( purchaseRecord.skuID == nil ) {
            anyProductNil = YES;
        }
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
        [convertedPurchaseDicts addObject:purchaseDict];       
    }
    
    completion(@[convertedPurchaseDicts]);
}

RCT_EXPORT_METHOD(isSKUIDPurchased:(nonnull NSString*)skuID completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [NamiPurchaseManager isSKUIDPurchased:skuID];
    completion(@[[NSNumber numberWithBool:active]]);
}

RCT_EXPORT_METHOD(restorePurchases:(RCTResponseSenderBlock)completion)
{
    NSLog(@"NamiBridge: Info: Calling RestorePurchases");
    [NamiPurchaseManager restorePurchasesWithHandler:^(BOOL success, NSError * _Nullable error) {
        NSString *errorDesc = [error localizedDescription];
        NSDictionary *retDict;
        if ([errorDesc length] > 0) {
           retDict = @{@"success": [NSNumber numberWithBool:success], @"error": [error localizedDescription]};
        } else {
            retDict = @{@"success": [NSNumber numberWithBool:success]};
        }
        
        NSLog(@"NamiBridge: Info: RestorePurchases Returned %@", retDict);
        completion(@[retDict]);
    }];
}

RCT_EXPORT_METHOD(anySKUIDPurchased:(nonnull NSArray*)skuIDs completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = false;
    for (NamiPurchase *purchase in [NamiPurchaseManager allPurchases]) {
        if ( [skuIDs containsObject:purchase.skuID] ) {
            active = true;
            break;
        }
    }

    completion(@[[NSNumber numberWithBool:active]]);
}

/// This method does the purchase work, and can optionally be fed a paywall metadata object to pass along to the purchase flow.
- (void) doSKUPurchaseWithSKUID:(nonnull NSString*)skuID namiPaywall:(NamiPaywall * _Nullable)namiPaywall completion:(RCTResponseSenderBlock)completion {
    [NamiPurchaseManager skusForSKUIDsWithSkuIDs:@[skuID] productHandler:^(BOOL success, NSArray<NamiSKU *> * _Nullable products, NSArray<NSString *> * _Nullable invalidProducts, NSError * _Nullable error) {
        NSLog(@"NamiBridge: Info: Products found are %@, product fetch error is %@", products, [error localizedDescription]);
        NamiSKU *useProduct = products.firstObject;
        if (useProduct != nil) {
            [NamiPurchaseManager buySKU:useProduct fromPaywall:namiPaywall responseHandler:^(NSArray<NamiPurchase *> * _Nonnull purchase, NamiPurchaseState purchaseState, NSError * _Nullable error) {
                NSLog(@"NamiBridge: Info: Purchase result is %@, purchased is %d, purchaseState is %@, error is %@", purchase, (purchaseState == NamiPurchaseStatePurchased), [NSNumber numberWithInt:(int)purchaseState], [error localizedDescription]);
                if (purchaseState == NamiPurchaseStatePurchased) {
                    completion(@[[NSNumber numberWithBool:true]]);
                } 
            }];
        } else {
            completion(@[[NSNumber numberWithBool:false]]);
        }
    }];

}

RCT_EXPORT_METHOD(buySKU:(nonnull NSString*)skuID paywallDeveloperID:(nonnull NSString*)paywallDeveloperID completion:(RCTResponseSenderBlock)completion)
{
    if (paywallDeveloperID.length > 0) {
        [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:paywallDeveloperID :^(NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nullable namiPaywall)  {
            [self doSKUPurchaseWithSKUID:skuID namiPaywall:namiPaywall completion:completion];
        }];
    } else {
        [self doSKUPurchaseWithSKUID:skuID namiPaywall:nil completion:completion];
    }
}

@end

@implementation NamiPurchaseManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiPurchaseManagerBridge, NamiPurchaseManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
