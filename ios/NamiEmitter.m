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

@interface RCT_EXTERN_MODULE(NamiEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(allPurchasedProducts)
RCT_EXTERN_METHOD(getPurchasedProducts: (RCTResponseSenderBlock)callback)
@end

@implementation NamiEmitter : RCTEventEmitter

- (instancetype)init
{
  self = [super init];
  if (self) {
    hasListeners = NO;
    
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

bool hasListeners;

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

- (void)sendEventPurchased {
  if (hasListeners) {
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
  if (hasListeners) {
      // Pass along paywall ID and paywall metadata for use in sign-in provider.
      [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
                                                        @"paywallMeta": paywallMetadata, }];
  }
}

- (NSDictionary<NSString *,NSString *> *) productToProductDict:(NamiMetaProduct *)product {
    NSMutableDictionary<NSString *,NSString *> *productDict = [NSMutableDictionary new];
    
    productDict[@"productIdentifier"] = product.productIdentifier;

    SKProduct *productInt = product.product;
    productDict[@"localizedTitle"] = productInt.localizedTitle;
    productDict[@"localizedDescription"] = productInt.localizedDescription;
    productDict[@"localizedPrice"] = productInt.localizedPrice;
    productDict[@"localizedMultipliedPrice"] = productInt.localizedMultipliedPrice;
    productDict[@"price"] = productInt.price.stringValue;
    productDict[@"priceLocale"] = productInt.priceLocale.localeIdentifier;
    
    if (@available(iOS 12.0, *)) {
        productDict[@"subscriptionGroupIdentifier"] = productInt.subscriptionGroupIdentifier;
    }
    
    if (@available(iOS 11.2, *)) {
        SKProductSubscriptionPeriod *subscriptionPeriod = productInt.subscriptionPeriod;
                
        if (subscriptionPeriod != NULL) {
            NSUInteger numberOfUnits = subscriptionPeriod.numberOfUnits;
            SKProductPeriodUnit periodUnit = subscriptionPeriod.unit;
            
            productDict[@"numberOfUnits"] = [NSString stringWithFormat:@"%lui", numberOfUnits];
            productDict[@"periodUnit"] = [NSString stringWithFormat:@"%lui", periodUnit];
        }
    }

    return productDict;
}

- (void)sendPaywallActivatedFromVC:(UIViewController * _Nullable) fromVC
                        forPaywall:(NSString * _Nonnull) developerPaywallID
                      withProducts:(NSArray<NamiMetaProduct *> * _Nullable) products
                       paywallMeta:(NamiMetaPaywall * _Nonnull) paywallMetadata  {
  if (hasListeners) {
    NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
    for (NamiMetaProduct *product in products) {
      [productDicts addObject:[self productToProductDict:product]];
    }
    
      [self sendEventWithName:@"AppPaywallActivate" body:@{ @"products": productDicts,
                                                            @"developerPaywallID": developerPaywallID,
                                                            @"paywallMeta": paywallMetadata, }];
  }
}

@end
