//
//  NamiPaywallManager.m
//  namiReactNative
//
//  Created by Kendall Gelner on 11/22/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(RNNamiPaywallManager, NSObject)

RCT_EXTERN_METHOD(buySkuComplete:(NSDictionary)dict)

RCT_EXTERN_METHOD(registerBuySkuHandler)

RCT_EXTERN_METHOD(registerCloseHandler:(BOOL)blockDismiss)

RCT_EXTERN_METHOD(dismiss:(BOOL)animated completion:(RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(displayedViewController)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

@interface NamiEmitter : RCTEventEmitter
- (void)sendEventPreparePaywallForDisplayFinishedWithResult:(BOOL)success developerPaywallID: (NSString * _Nullable) developerPaywallID error:(NSError * _Nullable) error;
+ (NamiEmitter *) reactInstance;
@end

@interface NamiPaywallManagerBridge : NSObject <RCTBridgeModule>
@property (atomic) BOOL blockPaywallRaise;
@end


@implementation NamiPaywallManagerBridge (RCTExternModule)

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setBlockPaywallRaise:false];
    }
    return self;
}

RCT_EXTERN_METHOD(raisePaywall)
- (void)raisePaywall {
    [NamiCampaignManager launch];
}

RCT_EXPORT_METHOD(raisePaywallByDeveloperPaywallId)
{
    [NamiCampaignManager launch];
}

RCT_EXPORT_METHOD(blockPaywallRaise:(BOOL)blockRaise)
{
    [self setBlockPaywallRaise:blockRaise];
}

@end

@implementation NamiPaywallManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiPaywallManagerBridge, NamiPaywallManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}



@end
