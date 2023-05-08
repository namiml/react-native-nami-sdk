//
//  NamiEmitter.m
//  namiReactNative
//
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <NamiApple/NamiApple.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"
#import <UIKit/UIKit.h>

#import "NamiBridgeUtil.h"

@interface RCT_EXTERN_MODULE(NamiEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(allPurchasedProducts)
RCT_EXTERN_METHOD(getPurchasedProducts: (RCTResponseSenderBlock)callback)
@end

static NamiEmitter *namiEmitter;

@implementation NamiEmitter : RCTEventEmitter

- (instancetype)init
{
    self = [super init];
    if (self) {
        hasNamiEmitterListeners = NO;

        // Tell Nami to listen for purchases and we'll forward them on to listeners
        [NamiPurchaseManager registerPurchasesChangedHandler:^(NSArray<NamiPurchase *> * _Nonnull purchases, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
            [self sendEventPurchaseMadeWithPurchases:purchases withState:purchaseState error:error];
        }];

        [NamiEntitlementManager registerActiveEntitlementsHandler:^(NSArray<NamiEntitlement *> * _Nonnull entitlements) {
            [self sendEventEntitlementsChangedWithEntitlements:entitlements];
        }];

        [NamiPaywallManager registerSignInHandler:^(UIViewController * _Nullable fromVC) {
            [self sendSignInActivateFromVC:fromVC];
        }];

//        [NamiPaywallManager registerCloseHandler:^(UIViewController * _Nullable fromVC) {
//            [self sendBlockingPaywallClosed];
//        }];

        [NamiPurchaseManager registerRestorePurchasesHandlerWithRestorePurchasesStateHandler:^(enum NamiRestorePurchasesState state, NSArray<NamiPurchase *> * _Nonnull newPurchases, NSArray<NamiPurchase *> * _Nonnull oldPurchases, NSError * _Nullable error) {
            [self sendRestorePurchasesStateChanged:state newPurchases:newPurchases oldPurchases:oldPurchases error:error];
        }];

        [NamiCustomerManager registerJourneyStateHandler:^(CustomerJourneyState * _Nonnull journeyState) {
            [self sendEventCustomerJourneyStateChanged:journeyState];
        }];
    }
    namiEmitter = self;
    return self;
}

- (void)dealloc {
    namiEmitter = nil;
}


+ (NamiEmitter *) reactInstance {
    return namiEmitter;
}

- (void) getPurchasedProducts : (RCTResponseSenderBlock) callback  {
    NSArray *allProducts = [self allPurchasedProducts];
    callback(allProducts);
}

- (NSArray<NSString *> *)allPurchasedProducts {
    NSArray<NamiPurchase *> *purchases = NamiPurchaseManager.allPurchases;
    NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
    for (NamiPurchase *purchase in purchases) {
        [productIDs addObject:purchase.skuId];
    }

    return productIDs;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"PurchasesChanged", @"SignInActivate", @"AppPaywallActivate", @"EntitlementsChanged", @"BlockingPaywallClosed", @"PreparePaywallFinished", @"RestorePurchasesStateChanged", @"CustomerJourneyStateChanged" ];
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

- (void)sendEventEntitlementsChangedWithEntitlements:(NSArray<NamiEntitlement *>*)entitlements {
    if (hasNamiEmitterListeners) {

        NSMutableArray *convertedEntitlementDicts = [NSMutableArray new];
        for ( NamiEntitlement *entitlementRecord in entitlements ) {
            if ( entitlementRecord.referenceId != nil ) {
                NSDictionary *entitlementDict = [NamiBridgeUtil entitlementToEntitlementDict:entitlementRecord];
                [convertedEntitlementDicts addObject:entitlementDict];
            }
        }

        NSMutableDictionary *sendDict = [NSMutableDictionary dictionary];
        sendDict[@"activeEntitlements"] =  convertedEntitlementDicts;

        [self sendEventWithName:@"EntitlementsChanged" body:sendDict];
    }
}

- (void)sendEventPreparePaywallForDisplayFinishedWithResult:(BOOL)success developerPaywallID: (NSString * _Nullable) developerPaywallID error:(NSError * _Nullable) error {
    if (hasNamiEmitterListeners) {

        NSMutableDictionary *sendDict = [NSMutableDictionary dictionaryWithDictionary: @{ @"success": @(success) }];

        if (developerPaywallID != nil) {
            [sendDict addEntriesFromDictionary:@{
                @"developerPaywallID": developerPaywallID
            }];
        }

        if (error != nil) {
            [sendDict addEntriesFromDictionary:@{
                @"errorCode": @(error.code),
                @"errorMessage": [error localizedDescription]
                }
            ];
        }

        NSLog(@"NamiBridge: Info: attempting to send result of preparePaywallForDisplay with result dictionary: %@", sendDict);
        [self sendEventWithName:@"PreparePaywallFinished" body:sendDict];
    }
}

- (void)sendEventCustomerJourneyStateChanged:(CustomerJourneyState *)journeyState {
    if (hasNamiEmitterListeners) {
        NSDictionary *sendDict = [NamiBridgeUtil customerJourneyStateDict];
        [self sendEventWithName:@"CustomerJourneyStateChanged" body:sendDict];
    }
}

- (void)sendEventPurchaseMadeWithPurchases:(NSArray<NamiPurchase *>*)purchases withState:(NamiPurchaseState)purchaseState error:(NSError *)error {
    if (hasNamiEmitterListeners) {


        NSString *convertedState = [self purchaseStateToString:purchaseState];

        NSMutableArray *convertedPurchaseDicts = [NSMutableArray new];
        for ( NamiPurchase *purchaseRecord in purchases ) {
            if ( purchaseRecord.skuId != nil ) {
                NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
                [convertedPurchaseDicts addObject:purchaseDict];
            }
        }

        NSString *localizedErrorDescription = [error localizedDescription];

        NSMutableDictionary *sendDict = [NSMutableDictionary dictionary];
        sendDict[@"purchases"] =  convertedPurchaseDicts;
        sendDict[@"purchaseState"] = convertedState;
        if (localizedErrorDescription != nil) {
           sendDict[@"error"] = localizedErrorDescription;
        }

        [self sendEventWithName:@"PurchasesChanged" body:sendDict];
    }
}


- (void) sendSignInActivateFromVC:(UIViewController * _Nullable) fromVC {
  if (hasNamiEmitterListeners) {
      // Pass along paywall ID use in sign-in provider.
      [self sendEventWithName:@"SignInActivate" body:@{ }];
  }
}

//- (void)sendPaywallActivatedForPaywall:(NSString * _Nonnull) developerPaywallID
//                      withProducts:(NSArray<NamiSKU *> * _Nullable) products
//                       paywallMetadata:(NamiPaywall * _Nonnull) paywallMetadata  {
//    if (hasNamiEmitterListeners) {
//    NSMutableArray<NSDictionary<NSString *,NSString *> *> *skuDicts = [NSMutableArray new];
//    for (NamiSKU *sku in products) {
//      [skuDicts addObject:[NamiBridgeUtil skuToSKUDict:sku]];
//    }
//
//        NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionaryWithDictionary:paywallMetadata.namiPaywallInfoDict];
//        // This part is really meant to be internally facing, scrub from dictionary
//
//        NSMutableDictionary *marketingContentDictionary = [NSMutableDictionary dictionaryWithDictionary:paywallMeta[@"marketing_content"]];
//
//        // Populated SmartText formatted values in dictioanry to send
//        marketingContentDictionary[@"body"] = [paywallMetadata body];
//        marketingContentDictionary[@"title"] = [paywallMetadata title];
//        paywallMeta[@"marketing_content"] = marketingContentDictionary;
//        paywallMeta[@"purchase_terms"] = [paywallMetadata purchaseTerms];
//
//        // Strip out presention_position from all listed sku items
//        NSArray *cleanedOrderdMetadata = [NamiBridgeUtil stripPresentationPositionFromOrderedMetadataForPaywallMetaDict:paywallMeta];
//        [paywallMeta setObject:cleanedOrderdMetadata  forKey:@"formatted_skus"];
//
//        [paywallMeta removeObjectForKey:@"sku_ordered_metadata"];
//        [paywallMeta removeObjectForKey:@"skus"];
//
//        NSDictionary *paywallStylingDict = [NamiBridgeUtil paywallStylingToPaywallStylingDict:[paywallMetadata styleData]];
//        paywallMeta[@"styleData"] = paywallStylingDict;
//
//        // remove keys that are inconsistent with android
//        [paywallMeta removeObjectForKey:@"body"];
//        [paywallMeta removeObjectForKey:@"title"];
//        [paywallMeta removeObjectForKey:@"style"];
//
//        [self sendEventWithName:@"AppPaywallActivate" body:@{ @"namiSkus": skuDicts,
//                                                            @"developerPaywallID": developerPaywallID,
//                                                            @"paywallMetadata": paywallMeta }];
//  }
//}

- (NSDictionary *)buildRestorePurchasesStateChangedDict: (enum NamiRestorePurchasesState) state
                                           newPurchases: (NSArray<NamiPurchase *> * _Nonnull) newPurchases
                                           oldPurchases: (NSArray<NamiPurchase *> * _Nonnull) oldPurchases
                                                  error: (NSError * _Nullable) error {
    NSString *errorDesc = [error localizedDescription];
    NSDictionary *initialDict;
    if ([errorDesc length] > 0) {
        initialDict = @{@"state": [NSNumber numberWithBool:state], @"stateDesc": [self restorePurchaseStateDescriptionFromCode:state], @"error": [error localizedDescription]};
    } else {
        initialDict = @{@"state": [NSNumber numberWithBool:state], @"stateDesc": [self restorePurchaseStateDescriptionFromCode:state]};
    }

    NSMutableDictionary *retDict = [NSMutableDictionary dictionary];
    [retDict addEntriesFromDictionary:initialDict];

    NSMutableArray *newPurchaseDicts = [NSMutableArray array];
    for ( NamiPurchase *purchaseRecord in newPurchases ) {
        if ( purchaseRecord.skuId == nil ) {
        }
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
        [newPurchaseDicts addObject:purchaseDict];
    }

    NSMutableArray *oldPurchaseDicts = [NSMutableArray array];
    for ( NamiPurchase *purchaseRecord in oldPurchases ) {
        if ( purchaseRecord.skuId == nil ) {
        }
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchaseRecord];
        [oldPurchaseDicts addObject:purchaseDict];
    }

    retDict[@"newPurchases"] = newPurchaseDicts;
    retDict[@"oldPurchases"] = oldPurchaseDicts;

    NSLog(@"NamiBridge: Info: RestorePurchases state change: %@", retDict);

    return retDict;
}

- (void)sendRestorePurchasesStateChanged: (enum NamiRestorePurchasesState) state
                            newPurchases: (NSArray<NamiPurchase *> * _Nonnull) newPurchases
                            oldPurchases: (NSArray<NamiPurchase *> * _Nonnull) oldPurchases
                                   error: (NSError * _Nullable) error {
    NSDictionary * retDict = [self buildRestorePurchasesStateChangedDict:state newPurchases:newPurchases oldPurchases:oldPurchases error:error];
    [self sendEventWithName:@"RestorePurchasesStateChanged" body:retDict];
}

- (NSString *) restorePurchaseStateDescriptionFromCode:(NamiRestorePurchasesState)stateCode {
    switch (stateCode) {
        case NamiRestorePurchasesStateStarted:
            return @"started";
            break;
        case NamiRestorePurchasesStateFinished:
            return @"finished";
            break;
        case NamiRestorePurchasesStateError:
            return @"error";
            break;
    }
}

- (void) sendBlockingPaywallClosed {
    // Let system know a blocking paywall has been closed, in case they want to react specifically.
    if (hasNamiEmitterListeners) {
        NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionary];

        // Strip out presention_position from all listed sku items
        NSArray *cleanedOrderdMetadata = [NamiBridgeUtil stripPresentationPositionFromOrderedMetadataForPaywallMetaDict:paywallMeta];
        [paywallMeta setObject:cleanedOrderdMetadata  forKey:@"formatted_skus"];

        [paywallMeta removeObjectForKey:@"sku_ordered_metadata"];
        [paywallMeta removeObjectForKey:@"skus"];

        [self sendEventWithName:@"BlockingPaywallClosed" body:@{ @"blockingPaywallClosed": @true }];
    }
}

@end
