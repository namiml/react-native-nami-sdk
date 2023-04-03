//
//  NamiCustomerManager.m
//  RNNami
//
//  Created by Kendall Gelner on 8/21/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiCustomerManager, NSObject)

RCT_EXTERN_METHOD(setCustomerAttributeh:(NSString *)key value:(NSString *)value)

RCT_EXTERN_METHOD(getCustomerAttribute:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(clearCustomerAttribute:(NSString *)key)

RCT_EXTERN_METHOD(clearAllCustomerAttributes)

RCT_EXTERN_METHOD(journeyState:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isLoggedIn:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(loggedInId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(login:(RCTPromiseResolveBlock)customerId completion:(nullable  RCTResponseSenderBlock)loginCompleteHandler)

RCT_EXTERN_METHOD(logout)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
