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



@interface NamiMLManagerBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiMLManagerBridge (RCTExternModule)


RCT_EXTERN_METHOD(enterCoreContentWithLabel:(NSString)label)
- (void)enterCoreContentWithLabel: (NSString *)label {
    [NamiMLManager enterCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(enterCoreContentWithLabels:(NSArray) label)
- (void)enterCoreContentWithLabels: (NSArray *)labels {
    NSMutableArray <NSString *>*sendLabels = [NSMutableArray array];
    for (NSObject *labelItem in labels) {
        if ([labelItem isKindOfClass:[NSString class]]) {
            [sendLabels addObject:(NSString *)labelItem];
        } else if ([labelItem respondsToSelector:@selector(stringValue)]) {
            [sendLabels addObject:(NSString *)[labelItem performSelector:@selector(stringValue)]];
        }
    }
    [NamiMLManager enterCoreContentWithLabels: sendLabels];
}

RCT_EXTERN_METHOD(exitCoreContentWithLabel:(NSString)label)
- (void)exitCoreContentWithLabel: (NSString *)label {
    [NamiMLManager exitCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(exitCoreContentWithLabels:(NSArray) label)
- (void)exitCoreContentWithLabels: (NSArray *)labels {
    NSMutableArray <NSString *>*sendLabels = [NSMutableArray array];
    for (NSObject *labelItem in labels) {
        if ([labelItem isKindOfClass:[NSString class]]) {
            [sendLabels addObject:(NSString *)labelItem];
        } else if ([labelItem respondsToSelector:@selector(stringValue)]) {
            [sendLabels addObject:(NSString *)[labelItem performSelector:@selector(stringValue)]];
        }
    }
    [NamiMLManager exitCoreContentWithLabels: sendLabels];
}

RCT_EXTERN_METHOD(coreActionWithLabel:(NSString)label)
- (void)coreActionWithLabel: (NSString *)label {
    [NamiMLManager coreActionWithLabel:label];
}

RCT_EXTERN_METHOD(coreActionWithLabels:(NSArray) label)
- (void)coreActionWithLabels: (NSArray *)labels {
    NSMutableArray <NSString *>*sendLabels = [NSMutableArray array];
    for (NSObject *labelItem in labels) {
        if ([labelItem isKindOfClass:[NSString class]]) {
            [sendLabels addObject:(NSString *)labelItem];
        } else if ([labelItem respondsToSelector:@selector(stringValue)]) {
            [sendLabels addObject:(NSString *)[labelItem performSelector:@selector(stringValue)]];
        }
    }
    // TODO: Add core action with labels to Nami SDK
    for (NSString *label in sendLabels) {
        [NamiMLManager coreActionWithLabel:label];
    }
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
