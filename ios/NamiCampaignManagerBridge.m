//
//  NamiCampaignManager.m
//  RNNami
//
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiCampaignManager, NSObject)

RCT_EXTERN_METHOD(launch:(nullable NSString *)label context:(nullable NSDictionary *)context completion:(RCTResponseSenderBlock)callback paywallCompletion:(RCTResponseSenderBlock)cpaywallCallback)

RCT_EXTERN_METHOD(allCampaigns:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCampaignAvailable:(nullable NSString *)label resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh)

RCT_EXTERN_METHOD(registerAvailableCampaignsHandler)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
