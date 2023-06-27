//
//  NamiCustomerManager.m
//  RNNami
//
//  Copyright © 2020-2023 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiCustomerManager, NSObject)

RCT_EXTERN_METHOD(setCustomerAttribute:(NSString *)key value:(NSString *)value)

RCT_EXTERN_METHOD(getCustomerAttribute:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCustomerAttribute:(NSString *)key)

RCT_EXTERN_METHOD(clearAllCustomerAttributes)

RCT_EXTERN_METHOD(setCustomerDataPlatformId:(NSString *)platformId)

RCT_EXTERN_METHOD(clearCustomerDataPlatformId)

RCT_EXTERN_METHOD(setAnonymousMode:(BOOL *)anonymousMode)

RCT_EXTERN_METHOD(inAnonymousMode:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(journeyState:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isLoggedIn:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loggedInId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(deviceId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(login:(NSString *)customerId completion:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(logout:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(registerJourneyStateHandler)

RCT_EXTERN_METHOD(registerAccountStateHandler)


+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
