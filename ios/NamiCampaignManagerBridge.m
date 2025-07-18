//
//  NamiCampaignManagerBridge.m
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiCampaignManager, NSObject)

RCT_EXTERN_METHOD(launch:(nullable NSString *)label withUrl:(nullable NSString *)withUrl context:(nullable NSDictionary *)context completion:(RCTResponseSenderBlock)callback paywallCompletion:(RCTResponseSenderBlock)paywallCallback);

RCT_EXTERN_METHOD(allCampaigns:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCampaignAvailable:(nullable NSString *)campaignSource resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerAvailableCampaignsHandler)

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

@end
