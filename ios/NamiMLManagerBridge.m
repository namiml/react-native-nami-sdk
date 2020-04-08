//
//  NamiMLManagerBridge.m
//  RNNami
//
//  Created by Kendall Gelner on 4/6/20.
//  Copyright © 2020 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <Nami/Nami.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"


@interface NamiMLManager (RCTExternModule) <RCTBridgeModule>
 @end

@implementation NamiMLManager (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(NamiMLManager, NamiMLManager)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}



@end



@interface NamiMLManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiMLManagerBridge (RCTExternModule)


RCT_EXTERN_METHOD(enterCoreContentWithLabel:(NSString)label)
- (void)enterCoreContentWithLabel: (NSString *)label {
    [NamiMLManager enterCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(exitCoreContentWithLabel:(NSString)label)
- (void)exitCoreContentWithLabel: (NSString *)label {
    [NamiMLManager exitCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(coreActionWithLabel:(NSString)label)
- (void)coreActionWithLabel: (NSString *)label {
    [NamiMLManager coreActionWithLabel:label];
}

@end


@implementation NamiMLManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiMLManagerBridge, NamiMLManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}
@end
