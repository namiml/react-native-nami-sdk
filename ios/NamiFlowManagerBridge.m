//
// NamiFlowManagerBridge.m
// RNNami
//
// Copyright © 2025 Nami ML Inc.. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNNamiFlowManager, RCTEventEmitter)
RCT_EXTERN_METHOD(registerStepHandoff)
RCT_EXTERN_METHOD(registerEventHandler)
RCT_EXTERN_METHOD(resume)
RCT_EXTERN_METHOD(pause)
RCT_EXTERN_METHOD(finish)
RCT_EXTERN_METHOD(isFlowOpen:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
