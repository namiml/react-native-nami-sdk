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
    CustomerJourneyState *journeyState = [NamiCustomerManager currentCustomerJourneyState];
    
    BOOL formerSubscriber = [journeyState formerSubscriber];
    BOOL inGracePeriod = [journeyState inGracePeriod];
    BOOL inTrialPeriod = [journeyState inTrialPeriod];
    BOOL inIntroOfferPeriod = [journeyState inIntroOfferPeriod];
    
    NSDictionary *journeyDict = @{@"formerSubscriber":@(formerSubscriber),
                                  @"inGracePeriod":@(inGracePeriod),
                                  @"inTrialPeriod":@(inTrialPeriod),
                                  @"inIntroOfferPeriod":@(inIntroOfferPeriod)
    };
    
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
