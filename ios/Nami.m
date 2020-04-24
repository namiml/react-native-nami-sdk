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



@interface NamiBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiBridge (RCTExternModule)

RCT_EXTERN_METHOD(configure:(NSDictionary)configDict)
- (void)configure: (NSDictionary *)configDict {
    
    NSString *appID = configDict[@"appPlatformID-apple"];
    
    if ([appID length] > 0 ) {
        NamiConfiguration *config = [NamiConfiguration configurationForAppPlatformID:appID];
        
        NSString *logLevelString = configDict[@"logLevel"];
        if ([logLevelString isEqualToString:@"DEBUG"]) {
            // Will have to figure out how to get this from a react app later... may include that in the call.
            config.logLevel = NamiLogLevelDebug;
        } else if ([logLevelString isEqualToString:@"ERROR" ]) {
            config.logLevel = NamiLogLevelError;
        }
        
        BOOL bypassString = configDict[@"bypassStore"];
        if (bypassString) {
            config.bypassStore = true;
        }
        
        [Nami configureWithNamiConfig:config];
    }
}

RCT_EXTERN_METHOD(performNamiCommand:(NSString)namiCommand)
- (void)performNamiCommand: (NSString *)command {
    [NamiCommand performCommand:command];
}

RCT_EXTERN_METHOD(setExternalIdentfier:(NSString)externalIdentifier type:(NSString)type)
- (void)setExternalIdentfier: (NSString *)externalIdentifier  type:(NSString *)type {
    
    NamiExternalIdentifierType useType;
     
    if ( [type isEqualToString:@"sha256"] ) {
        useType = NamiExternalIdentifierTypeSha256;
    } else {
        useType = NamiExternalIdentifierTypeUuid;
    }

    [Nami setExternalIdentifierWithExternalIdentifier:externalIdentifier type:useType];
}

RCT_EXPORT_METHOD(getExternalIdentifier:(RCTResponseSenderBlock)completion)
{
    NSString *externalIdentifier = [Nami getExternalIdentifier];
   
    if (externalIdentifier == NULL || [externalIdentifier length] == 0) {
        completion(@[]);
    } else {
        completion(@[externalIdentifier]);
    }
}

RCT_EXTERN_METHOD(clearExternalIdentfier)
- (void)clearExternalIdentfier {
    [Nami clearExternalIdentifier];
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
