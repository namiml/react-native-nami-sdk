//
//  NamiEntitlementManagerBridge.m
//  RNNami
//
//  Created by Kendall Gelner on 4/8/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

//#import <Foundation/Foundation.h>
//#import <NamiApple/NamiApple.h>
//#import "NamiBridgeUtil.h"
//
//#import <React/RCTBridgeModule.h>
//#import <React/RCTEventEmitter.h>
//
//#import "React/RCTViewManager.h"
//
//
//
//
//@interface NamiEntitlementManagerBridge : NSObject <RCTBridgeModule>
//@end
//@implementation NamiEntitlementManagerBridge (RCTExternModule)
//
//
//RCT_EXPORT_METHOD(isEntitlementActive:(nonnull NSString*)entitlementRefID completion:(RCTResponseSenderBlock)completion)
//{
//    BOOL active = [NamiEntitlementManager isEntitlementActive:entitlementRefID];
//    NSLog(@"Checking for %@ entitlement active, result was %@", entitlementRefID, [NSNumber numberWithBool:active] );
//    completion(@[[NSNumber numberWithBool:active]]);
//}
//
//
//RCT_EXPORT_METHOD(getEntitlements:(RCTResponseSenderBlock)completion)
//{
//    NSArray<NamiEntitlement *> *entitlements = [NamiEntitlementManager available];
//
//    NSMutableArray *entitlementDicts = [NSMutableArray new];
//
//       for (NamiEntitlement *entitlement in entitlements) {
//           NSDictionary *entitlementDict = [NamiBridgeUtil entitlementToEntitlementDict:entitlement];
//           if ([entitlementDict count] > 0) {
//               [entitlementDicts addObject:entitlementDict];
//           }
//       }
//
//       completion(@[entitlementDicts]);
//}
//
//
//RCT_EXPORT_METHOD(activeEntitlements:(RCTResponseSenderBlock)completion)
//{
//    NSArray<NamiEntitlement *> *entitlements = [NamiEntitlementManager active];
//
//    NSMutableArray *entitlementDicts = [NSMutableArray new];
//
//    for (NamiEntitlement *entitlement in entitlements) {
//        NSDictionary *entitlementDict = [NamiBridgeUtil entitlementToEntitlementDict:entitlement];
//        if ([entitlementDict count] > 0) {
//            [entitlementDicts addObject:entitlementDict];
//        }
//    }
//
//    completion(@[entitlementDicts]);
//}
//
//@end
//
//
//@implementation NamiEntitlementManagerBridge
//RCT_EXPORT_MODULE_NO_LOAD(NamiEntitlementManagerBridge, NamiEntitlementManagerBridge)
//
//- (dispatch_queue_t)methodQueue
//{
//  return dispatch_get_main_queue();
//}
//
//+ (BOOL)requiresMainQueueSetup {
//  return YES;
//}
//@end

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNNamiEntitlementManager, NSObject)

RCT_EXTERN_METHOD(isEntitlementActive:(nullable NSString *)referenceId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(active:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(refresh)

RCT_EXTERN_METHOD(registerActiveEntitlementsHandler)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
