//
//  NamiEntitlementManagerBridge.m
//  RNNami
//
//  Created by Kendall Gelner on 4/8/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiEntitlementManager, NSObject)

RCT_EXTERN_METHOD(isEntitlementActive:(nullable NSString *)referenceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(active:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh)

RCT_EXTERN_METHOD(registerActiveEntitlementsHandler)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
