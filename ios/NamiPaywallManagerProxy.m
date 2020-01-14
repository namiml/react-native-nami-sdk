//
//  NamiPaywallManager.m
//  namiReactNative
//
//  Created by Kendall Gelner on 11/22/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"



@interface NamiPaywallManager (RCTExternModule) <RCTBridgeModule>
 @end

@implementation NamiPaywallManager (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(NamiPaywallManager, NamiPaywallManager)


RCT_EXTERN_METHOD(presentLivePaywallFromVC:(nullable UIViewController *)vc)
_RCT_EXTERN_REMAP_METHOD(sharedInstance,shared,YES)


+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end


@interface NamiPaywallManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiPaywallManagerBridge (RCTExternModule)

RCT_EXTERN_METHOD(sharedInstance)
- (NamiPaywallManager *)sharedInstance {
  return [NamiPaywallManager shared];
}

RCT_EXTERN_METHOD(raisePaywall)
- (void)raisePaywall {
  [[NamiPaywallManager shared] raisePaywallFromVC:nil];
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

