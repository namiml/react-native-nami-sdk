//
//  NamiCampaignManager.m
//  RNNami
//
//  Created by macbook on 27.03.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <React/RCTBridge.h>
#import "React/RCTViewManager.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiCampaignManager, NSObject)

RCT_EXTERN_METHOD(launch: label:(NSString *)label)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

