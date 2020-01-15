//
//  NamiStorekitHelperBridge.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Nami ML. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface NamiStoreKitHelper (RCTExternModule) <RCTBridgeModule>
 @end

@implementation NamiStoreKitHelper (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(NamiStoreKitHelper, NamiStoreKitHelper)


RCT_EXTERN_METHOD(clearBypassStoreKitPurchases)
_RCT_EXTERN_REMAP_METHOD(sharedInstance,shared,YES)


+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end


@interface NamiStoreKitHelperBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiStoreKitHelperBridge (RCTExternModule)

RCT_EXTERN_METHOD(sharedInstance)
- (NamiStoreKitHelper *)sharedInstance {
  return [NamiStoreKitHelper shared];
}

RCT_EXTERN_METHOD(clearBypassStoreKitPurchases)
- (void)clearBypassStoreKitPurchases {
  [[NamiStoreKitHelper shared] clearBypassStoreKitPurchases];
}

RCT_EXTERN_METHOD(bypassStoreKit:(BOOL)bypass)
- (void)bypassStoreKit: (BOOL) bypass {
  [[NamiStoreKitHelper shared] bypassStoreKitWithBypass:bypass];
}

RCT_EXPORT_METHOD(anyProductPurchased:(nonnull NSArray*)productIDs completion:(RCTResponseSenderBlock)completion)
{
    BOOL active = [[NamiStoreKitHelper shared] anyProductPurchased:productIDs];
    completion(@[[NSNumber numberWithBool:active]]);
}

@end

@implementation NamiStoreKitHelperBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiStoreKitHelperBridge, NamiStoreKitHelperBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
