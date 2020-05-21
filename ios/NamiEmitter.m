//
//  NamiEmitter.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"
#import <UIKit/UIKit.h>

#import "NamiBridgeUtil.h"

@interface RCT_EXTERN_MODULE(NamiEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(allPurchasedProducts)
RCT_EXTERN_METHOD(getPurchasedProducts: (RCTResponseSenderBlock)callback)
@end

@implementation NamiEmitter : RCTEventEmitter

- (instancetype)init
{
    self = [super init];
    if (self) {
        hasNamiEmitterListeners = NO;
        
        // Tell Nami to listen for purchases and we'll forward them on to listeners
        [NamiPurchaseManager registerWithPurchasesChangedHandler:^(NSArray<NamiPurchase *> * _Nonnull products, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
            if ( purchaseState == NamiPurchaseStatePurchased ) {
                [self sendEventPurchasedWithState:purchaseState error:error];
            }
        }];
        
        [NamiPaywallManager registerWithApplicationSignInProvider:^(UIViewController * _Nullable fromVC, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nonnull paywallMetadata) {
            [self sendSignInActivateFromVC:fromVC forPaywall:developerPaywallID paywallMetadata:paywallMetadata];
        }];
        
        [NamiPaywallManager registerWithApplicationPaywallProvider:^(UIViewController * _Nullable fromVC, NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nonnull paywallMetadata) {
            [self sendPaywallActivatedFromVC:fromVC forPaywall:developerPaywallID withProducts:products paywallMetadata:paywallMetadata];
        }];
        
    }
    return self;
}

- (void) getPurchasedProducts : (RCTResponseSenderBlock) callback  {
    NSArray *allProducts = [self allPurchasedProducts];
    callback(allProducts);
}

- (NSArray<NSString *> *)allPurchasedProducts {
    NSArray<NamiPurchase *> *purchases = NamiPurchaseManager.allPurchases;
    NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
    for (NamiPurchase *purchase in purchases) {
        [productIDs addObject:purchase.skuID];
    }
    
    return productIDs;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"PurchasesChanged", @"SignInActivate", @"AppPaywallActivate" ];
}

- (NSDictionary<NSString *, NSObject *> *)constantsToExport {
    return @{@"initialPurchasedProducts" : [self allPurchasedProducts]};
}

bool hasNamiEmitterListeners;

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasNamiEmitterListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasNamiEmitterListeners = NO;
}

-(NSString *)purchaseStateToString:(NamiPurchaseState)purchaseState {
    switch (purchaseState) {
  
        case NamiPurchaseStatePending:
            return @"PENDING";
            break;
        case NamiPurchaseStatePurchased:
            return @"PURCHASED";
            break;
        case NamiPurchaseStateConsumed:
            return @"CONSUMED";
            break;
        case NamiPurchaseStateResubscribed:
            return @"RESUBSCRIBED";
            break;
        case NamiPurchaseStateUnsubscribed:
            return @"UNSUBSCRIBED";
            break;
        case NamiPurchaseStatePurchasedNotValidated:
            return @"PURCHASEDNOTVALIDATED";
            break;
        case NamiPurchaseStateDeferred:
            return @"DEFERRED";
            break;
        case NamiPurchaseStateFailed:
            return @"FAILED";
            break;
        case NamiPurchaseStateCancelled:
            return @"CANCELLED";
            break;       
        case NamiPurchaseStateUnknown:
            return @"UNKNOWN";
            break;
        default:
            return @"UNKNOWN";
            break;
    }
}

- (void)sendEventPurchasedWithState:(NamiPurchaseState)purchaseState error:(NSError *)error {
    if (hasNamiEmitterListeners) {
        NSArray<NamiPurchase *> *purchases = [NamiPurchaseManager allPurchases];
        NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
        for (NamiPurchase *purchase in purchases) {
            if (purchase.skuID != nil) {
                [productIDs addObject:purchase.skuID];
            }
        }
        
        NSString *convertedState = [self purchaseStateToString:purchaseState];
        
        NSString *localizedErrorDescription = [error localizedDescription];
        
        NSMutableDictionary *sendDict = [NSMutableDictionary dictionary];
        sendDict[@"skuIDs"] =  productIDs;
        sendDict[@"purchaseState"] = convertedState;
        if (localizedErrorDescription != nil) {
           sendDict[@"errorDescription"] = localizedErrorDescription;
        }
        
        [self sendEventWithName:@"PurchasesChanged" body:sendDict];
    }
}

- (void) sendSignInActivateFromVC:(UIViewController * _Nullable) fromVC
                       forPaywall:(NSString * _Nonnull) developerPaywallID
                      paywallMetadata:(NamiPaywall * _Nonnull) paywallMetadata {
  if (hasNamiEmitterListeners) {
      // Pass along paywall ID and paywall metadata for use in sign-in provider.
      [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
                                                        @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
  }
}

- (void)sendPaywallActivatedFromVC:(UIViewController * _Nullable) fromVC
                        forPaywall:(NSString * _Nonnull) developerPaywallID
                      withProducts:(NSArray<NamiSKU *> * _Nullable) products
                       paywallMetadata:(NamiPaywall * _Nonnull) paywallMetadata  {
    if (hasNamiEmitterListeners) {
    NSMutableArray<NSDictionary<NSString *,NSString *> *> *skuDicts = [NSMutableArray new];
    for (NamiSKU *sku in products) {
      [skuDicts addObject:[NamiBridgeUtil skuToSKUDict:sku]];
    }

      [self sendEventWithName:@"AppPaywallActivate" body:@{ @"skus": skuDicts,
                                                            @"developerPaywallID": developerPaywallID,
                                                            @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
  }
}

@end
