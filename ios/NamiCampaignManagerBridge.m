//
//  NamiCampaignManagerBridge.m
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNNamiCampaignManager, RCTEventEmitter)

RCT_EXTERN_METHOD(launch:(nullable NSString *)label withUrl:(nullable NSString *)withUrl context:(nullable NSDictionary *)context completion:(RCTResponseSenderBlock)callback paywallCompletion:(RCTResponseSenderBlock)paywallCallback);

RCT_EXTERN_METHOD(allCampaigns:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isCampaignAvailable:(nullable NSString *)campaignSource resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(isFlow:(nullable NSString *)label withUrl:(nullable NSString *)withUrl resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(registerAvailableCampaignsHandler)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
