//
//  Nami.m
//  RNNami
//
//  Created by Kendall Gelner on 1/7/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"



@interface Nami (RCTExternModule) <RCTBridgeModule>
 @end

@implementation Nami (RCTExternModule)
RCT_EXPORT_MODULE_NO_LOAD(Nami, Nami)


+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end


@interface NamiBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiBridge (RCTExternModule)

RCT_EXTERN_METHOD(configure:(NSDictionary)configDict)
- (void)configure: (NSDictionary *)configDict {
    
    NSString *appID = configDict[@"appPlatformID"];
    
    if ([appID length] > 0 ) {
        NamiConfiguration *config = [NamiConfiguration configurationForAppPlatformID:appID];
        
        NSString *logLevelString = configDict[@"logLevel"];
        if ([logLevelString isEqualToString:@"DEBUG"]) {
            // Will have to figure out how to get this from a react app later... may include that in the call.
            config.logLevel = NamiLogLevelDebug;
        } else if ([logLevelString isEqualToString:@"ERROR" ]) {
            config.logLevel = NamiLogLevelError;
        }
        
        [Nami configureWithNamiConfig:config];
    }
}

RCT_EXTERN_METHOD(performNamiCommand:(NSString)namiCommand)
- (void)performNamiCommand: (NSString *)command {
    [NamiCommand performCommand:command];
}

RCT_EXTERN_METHOD(enterCoreContentWithLabel:(NSString)namiCommand)
- (void)enterCoreContentWithLabel: (NSString *)label {
    [NamiMLManager enterCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(exitCoreContentWithLabel:(NSString)namiCommand)
- (void)exitCoreContentWithLabel: (NSString *)label {
    [NamiMLManager exitCoreContentWithLabel:label];
}

RCT_EXTERN_METHOD(coreActionWithLabel:(NSString)namiCommand)
- (void)coreActionWithLabel: (NSString *)label {
    [NamiMLManager coreActionWithLabel:label];
}

@end

@implementation NamiBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiBridge, NamiBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}



@end
