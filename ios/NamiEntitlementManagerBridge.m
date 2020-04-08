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


@interface NamiEntitlementManager (RCTExternModule) <RCTBridgeModule>
 @end

@implementation NamiEntitlementManager (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(NamiEntitlementManager, NamiEntitlementManager)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}



@end



@interface NamiEntitlementManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiEntitlementManagerBridge (RCTExternModule)


RCT_EXPORT_METHOD(isEntitlementActive:(nonnull NSString*)entitlementRefID completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [NamiEntitlementManager isEntitlementActive:entitlementRefID];
    completion(@[[NSNumber numberWithBool:active]]);
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
