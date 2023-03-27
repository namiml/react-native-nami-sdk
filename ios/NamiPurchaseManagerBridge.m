//
//  NamiPurchaseManagerBridge.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface NamiEmitter : RCTEventEmitter
- (void)sendRestorePurchasesStateChanged: (enum NamiRestorePurchasesState) state
                            newPurchases: (NSArray<NamiPurchase *> * _Nonnull) newPurchases
                            oldPurchases: (NSArray<NamiPurchase *> * _Nonnull) oldPurchases
                                   error: (NSError * _Nullable) error;
- (NSDictionary *)buildRestorePurchasesStateChangedDict: (enum NamiRestorePurchasesState) state
                                           newPurchases: (NSArray<NamiPurchase *> * _Nonnull) newPurchases
                                           oldPurchases: (NSArray<NamiPurchase *> * _Nonnull) oldPurchases
                                                  error: (NSError * _Nullable) error;
+ (NamiEmitter *) reactInstance;
@end

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
        if ( purchaseRecord.skuId == nil ) {
            anyProductNil = YES;
        }
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
        [convertedPurchaseDicts addObject:purchaseDict];
    }

    completion(@[convertedPurchaseDicts]);
}

RCT_EXPORT_METHOD(isSKUIDPurchased:(nonnull NSString*)skuID completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [NamiPurchaseManager skuPurchased:skuID];
    completion(@[[NSNumber numberWithBool:active]]);
}

RCT_EXPORT_METHOD(restorePurchasesWithCompletionHandler:(RCTResponseSenderBlock)completion)
{
    NSLog(@"NamiBridge: Info: Calling RestorePurchasesWithCompletionHandler");

    [NamiPurchaseManager restorePurchasesWithStatehandler:^(enum NamiRestorePurchasesState state, NSArray<NamiPurchase *> * _Nonnull newPurchases, NSArray<NamiPurchase *> * _Nonnull oldPurchases, NSError * _Nullable error) {
        NSDictionary *retDict = [[NamiEmitter reactInstance] buildRestorePurchasesStateChangedDict:state newPurchases:newPurchases oldPurchases:oldPurchases error:error];
        completion(@[retDict]);
    }];
}

RCT_EXPORT_METHOD(restorePurchases)
{
    NSLog(@"NamiBridge: Info: Calling RestorePurchases");

    [NamiPurchaseManager restorePurchasesWithStatehandler:^(enum NamiRestorePurchasesState state, NSArray<NamiPurchase *> * _Nonnull newPurchases, NSArray<NamiPurchase *> * _Nonnull oldPurchases, NSError * _Nullable error) {
        [[NamiEmitter reactInstance] sendRestorePurchasesStateChanged:state newPurchases:newPurchases oldPurchases:oldPurchases error:error];
    }];
}

/// Determines if any one of the passed in SKUID's have been purchased.
RCT_EXPORT_METHOD(anySKUIDPurchased:(nonnull NSArray*)skuIDs completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = false;
    for (NamiPurchase *purchase in [NamiPurchaseManager allPurchases]) {
        if ( [skuIDs containsObject:purchase.skuId] ) {
            active = true;
            break;
        }
    }

    completion(@[[NSNumber numberWithBool:active]]);
}

/// For consumable purchases, removes the SKU from Nami so a product may be purchased again.
RCT_EXPORT_METHOD(consumePurchasedSKU:(nonnull NSString*)skuID)
{
    [NamiPurchaseManager consumePurchasedSkuWithSkuId:skuID];
}

/// For consumable purchases, removes the SKU from Nami so a product may be purchased again.
RCT_EXPORT_METHOD(presentCodeRedemptionSheet)
{
    if (@available(iOS 14.0, *)) {
        [NamiPurchaseManager presentCodeRedemptionSheet];
    } else {
        NSLog(@"NamiBridge: Warning: presentCodeRedemptionSheet only present in iOS14 and higher");
    }
}

RCT_EXPORT_METHOD(canPresentCodeRedemptionSheet:(RCTResponseSenderBlock)completion)
{
    if (@available(iOS 14.0, *)) {
        completion(@[[NSNumber numberWithBool:true]]);
    } else {
        completion(@[[NSNumber numberWithBool:false]]);
    }
}

/// This method does the purchase work, and can optionally be fed a paywall metadata object to pass along to the purchase flow.
- (void) doSKUPurchaseWithSKUID:(nonnull NSString*)skuID namiPaywall:(NamiPaywall * _Nullable)namiPaywall completion:(RCTResponseSenderBlock)completion {
    [NamiPurchaseManager skusForSKUIdsWithSkuIds:@[skuID] productHandler:^(BOOL success, NSArray<NamiSKU *> * _Nullable products, NSArray<NSString *> * _Nullable invalidProducts, NSError * _Nullable error) {
        NSLog(@"NamiBridge: Info: Products found are %@, product fetch error is %@", products, [error localizedDescription]);
        NamiSKU *useProduct = products.firstObject;
        if (useProduct != nil) {
            [NamiPurchaseManager buySku:useProduct responseHandler:^(NSArray<NamiPurchase *> * _Nonnull purchase, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
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
