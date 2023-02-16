//
//  NamiCustomerManager.m
//  RNNami
//
//  Created by Kendall Gelner on 8/21/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface NamiCustomerManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiCustomerManagerBridge (RCTExternModule)


RCT_EXPORT_METHOD(currentCustomerJourneyState:(RCTResponseSenderBlock)completion)
{
    NSDictionary *journeyDict = [NamiBridgeUtil customerJourneyStateDict];

    completion(@[journeyDict]);
}


@end


@implementation NamiCustomerManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiCustomerManagerBridge, NamiCustomerManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
