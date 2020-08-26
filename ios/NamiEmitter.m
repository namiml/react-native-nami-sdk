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
        [NamiPurchaseManager registerWithPurchasesChangedHandler:^(NSArray<NamiPurchase *> * _Nonnull purchases, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
            [self sendEventPurchaseMadeWithPurchases:purchases withState:purchaseState error:error];
        }];
        
        [NamiEntitlementManager registerChangeHandlerWithEntitlementsChangedHandler:^(NSArray<NamiEntitlement *> * _Nonnull entitlements) {
            [self sendEventEntitlementsChnagedithEntitlemnets:entitlements];
        }];
        
        [NamiPaywallManager registerWithApplicationSignInProvider:^(UIViewController * _Nullable fromVC, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nonnull paywallMetadata) {
            [self sendSignInActivateFromVC:fromVC forPaywall:developerPaywallID paywallMetadata:paywallMetadata];
        }];
        
        [NamiPaywallManager registerWithApplicationPaywallProvider:^(UIViewController * _Nullable fromVC, NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nonnull paywallMetadata) {
            [self sendPaywallActivatedFromVC:fromVC forPaywall:developerPaywallID withProducts:products paywallMetadata:paywallMetadata];
        }];
        
        [NamiPaywallManager registerWithApplicationBlockingPaywallClosedHandler:^{
            [self sendBlockingPaywallClosed];
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

- (void)sendEventEntitlementsChnagedithEntitlemnets:(NSArray<NamiEntitlement *>*)entitlements {
    if (hasNamiEmitterListeners) {
        
        NSMutableArray *convertedEntitlementDicts = [NSMutableArray new];
        for ( NamiEntitlement *entitlementRecord in entitlements ) {
            if ( entitlementRecord.referenceID != nil ) {
                NSDictionary *entitlementDict = [NamiBridgeUtil entitlementToEntitlementDict:entitlementRecord];
                [convertedEntitlementDicts addObject:entitlementDict];
            }
        }
        
        NSMutableDictionary *sendDict = [NSMutableDictionary dictionary];
        sendDict[@"activeEntitlements"] =  convertedEntitlementDicts;
        
        [self sendEventWithName:@"EntitlementsChanged" body:sendDict];
    }
}

- (void)sendEventPurchaseMadeWithPurchases:(NSArray<NamiPurchase *>*)purchases withState:(NamiPurchaseState)purchaseState error:(NSError *)error {
    if (hasNamiEmitterListeners) {
        
        
        NSString *convertedState = [self purchaseStateToString:purchaseState];
        
        NSMutableArray *convertedPurchaseDicts = [NSMutableArray new];
        for ( NamiPurchase *purchaseRecord in purchases ) {
            if ( purchaseRecord.skuID != nil ) {
                NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
                [convertedPurchaseDicts addObject:purchaseDict];
            }
        }
        
        NSString *localizedErrorDescription = [error localizedDescription];
        
        NSMutableDictionary *sendDict = [NSMutableDictionary dictionary];
        sendDict[@"purchases"] =  convertedPurchaseDicts;
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
      NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionaryWithDictionary:paywallMetadata.namiPaywallInfoDict];
      // This part is really meant to be internally facing, scrub from dictionary
      [paywallMeta removeObjectForKey:@"formatted_skus"];
      [paywallMeta removeObjectForKey:@"skus"];
      [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
                                                        @"paywallMetadata": paywallMeta }];
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
        
        NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionaryWithDictionary:paywallMetadata.namiPaywallInfoDict];
        // This part is really meant to be internally facing, scrub from dictionary
        [paywallMeta removeObjectForKey:@"formatted_skus"];
        [paywallMeta removeObjectForKey:@"skus"];
        
        [self sendEventWithName:@"AppPaywallActivate" body:@{ @"skus": skuDicts,
                                                            @"developerPaywallID": developerPaywallID,
                                                            @"paywallMetadata": paywallMeta }];
  }
}

- (void) sendBlockingPaywallClosed {
    // Let system know a blocking paywall has been closed, in case they want to react specfiically.
    if (hasNamiEmitterListeners) {
        NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionary];
        // This part is really meant to be internally facing, scrub from dictionary
        [paywallMeta removeObjectForKey:@"formatted_skus"];
        
        [self sendEventWithName:@"BlockingPaywallClosed" body:@{ @"blockingPaywallClosed": @(true)}];
    }
}

@end
