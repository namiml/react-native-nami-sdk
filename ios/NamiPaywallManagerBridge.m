//
//  NamiPaywallManager.m
//  namiReactNative
//
//  Copyright © 2023 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RNNamiPaywallManager, NSObject)

RCT_EXTERN_METHOD(buySkuComplete:(NSDictionary)dict)

RCT_EXTERN_METHOD(registerBuySkuHandler)

RCT_EXTERN_METHOD(registerCloseHandler)

RCT_EXTERN_METHOD(registerSignInHandler)

RCT_EXTERN_METHOD(registerRestoreHandler)

RCT_EXTERN_METHOD(registerDeeplinkActionHandler)

RCT_EXTERN_METHOD(dismiss:(BOOL)animated)

RCT_EXTERN_METHOD(show)

RCT_EXTERN_METHOD(hide)

RCT_EXTERN_METHOD(isHidden:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isPaywallOpen:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(buySkuCancel)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
