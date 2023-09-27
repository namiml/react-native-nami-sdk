//
//  NamiManager.m
//  RNNami
//
//  Copyright © 2020-2023 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiManager, NSObject)

RCT_EXTERN_METHOD(sdkConfigured:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
