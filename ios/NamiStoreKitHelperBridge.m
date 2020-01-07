//
//  NamiStorekitHelperBridge.m
//  namiReactNative
//
//  Created by Kendall Helmstetter Gelner on 12/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
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

RCT_EXTERN_METHOD(bypassStoreKit)
- (void)bypassStoreKit {
  [[NamiStoreKitHelper shared] bypassStoreKitWithBypass:YES];
}

//RCT_EXTERN_METHOD(configureWithAppID:(NSString)appID)
//- (void)configureWithAppID: (NSString *)appID {
//  [[Nami shared] configureWithAppID:appID];
//}



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
