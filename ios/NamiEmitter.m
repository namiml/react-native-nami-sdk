//
//  NamiEmitter.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

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
    return @[@"PurchasesChanged"];
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

@end
