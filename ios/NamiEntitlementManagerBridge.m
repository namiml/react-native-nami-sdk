//
//  NamiEntitlementManagerBridge.m
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiEntitlementManager, NSObject)

RCT_EXTERN_METHOD(isEntitlementActive:(nullable NSString *)referenceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(active:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh)

RCT_EXTERN_METHOD(registerActiveEntitlementsHandler)

RCT_EXTERN_METHOD(clearProvisionalEntitlementGrants)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
