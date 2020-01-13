//
//  NamiEmitter.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
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
    [[NamiStoreKitHelper shared] registerWithPurchasesChangedHandler:^(NSArray<NamiMetaPurchase *> * _Nonnull products, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
      [self sendEventPurchased];
    }];
      
      [NamiPaywallManager registerWithApplicationSignInProvider:^(UIViewController * _Nullable fromVC, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nonnull paywallMetadata) {
      }];
                 
      [NamiPaywallManager registerWithApplicationPaywallProvider:^(UIViewController * _Nullable fromVC, NSArray<NamiMetaProduct *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nonnull paywallMetadata) {
          
      }];
      
  }
  
  return self;
}

- (void) getPurchasedProducts : (RCTResponseSenderBlock) callback  {
  NSArray *allProducts = [self allPurchasedProducts];
  callback(allProducts);
}

- (NSArray<NSString *> *)allPurchasedProducts {
  NSArray<NamiMetaPurchase *> *purchases = NamiStoreKitHelper.shared.allPurchasedProducts;
  NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
  for (NamiMetaProduct *purchase in purchases) {
    [productIDs addObject:purchase.productIdentifier];
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

- (void)sendEventPurchased {
  if (hasNamiEmitterListeners) {
    NSArray<NamiMetaPurchase *> *purchases = NamiStoreKitHelper.shared.allPurchasedProducts;
    NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
    for (NamiMetaProduct *purchase in purchases) {
      [productIDs addObject:purchase.productIdentifier];
    }
    
    [self sendEventWithName:@"PurchasesChanged" body:@{@"products": productIDs}];
  }
}

- (void) sendSignInActivateFromVC:(UIViewController * _Nullable) fromVC
                       forPaywall:(NSString * _Nonnull) developerPaywallID
                      paywallMeta:(NamiMetaPaywall * _Nonnull) paywallMetadata {
  if (hasNamiEmitterListeners) {
      // Pass along paywall ID and paywall metadata for use in sign-in provider.
      [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
                                                        @"paywallMeta": paywallMetadata.namiPaywallInfoDict, }];
  }
}

- (void)sendPaywallActivatedFromVC:(UIViewController * _Nullable) fromVC
                        forPaywall:(NSString * _Nonnull) developerPaywallID
                      withProducts:(NSArray<NamiMetaProduct *> * _Nullable) products
                       paywallMeta:(NamiMetaPaywall * _Nonnull) paywallMetadata  {
  if (hasNamiEmitterListeners) {
    NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
    for (NamiMetaProduct *product in products) {
      [productDicts addObject:[NamiBridgeUtil productToProductDict:product]];
    }
    
      [self sendEventWithName:@"AppPaywallActivate" body:@{ @"products": productDicts,
                                                            @"developerPaywallID": developerPaywallID,
                                                            @"paywallMeta": paywallMetadata.namiPaywallInfoDict, }];
  }
}

@end
