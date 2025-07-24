//
//  NamiPurchaseManagerBridge.m
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RNNamiPurchaseManager, NSObject)

RCT_EXTERN_METHOD(allPurchases:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(skuPurchased:(NSString *)skuId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(anySkuPurchased:(NSArray*)skuIds resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerPurchasesChangedHandler)

RCT_EXTERN_METHOD(registerRestorePurchasesHandler)

RCT_EXTERN_METHOD(presentCodeRedemptionSheet)

RCT_EXTERN_METHOD(restorePurchases)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
