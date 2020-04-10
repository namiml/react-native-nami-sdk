//
//  NamiEntitlementManagerBridge.m
//  RNNami
//
//  Created by Kendall Gelner on 4/8/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"




@interface NamiEntitlementManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiEntitlementManagerBridge (RCTExternModule)


RCT_EXPORT_METHOD(isEntitlementActive:(nonnull NSString*)entitlementRefID completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [NamiEntitlementManager isEntitlementActive:entitlementRefID];
    completion(@[[NSNumber numberWithBool:active]]);
}


RCT_EXPORT_METHOD(getEntitlements:(RCTResponseSenderBlock)completion)
{
    NSArray<NamiEntitlement *> *entitlements = [NamiEntitlementManager getEntitlements];
    
    completion(@[]);
}


RCT_EXPORT_METHOD(activeEntitlements:(RCTResponseSenderBlock)completion)
{
    NSArray<NamiEntitlement *> *entitlements = [NamiEntitlementManager activeEntitlements];
    
    completion(@[]);
}

@end


@implementation NamiEntitlementManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiEntitlementManagerBridge, NamiEntitlementManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}
@end
