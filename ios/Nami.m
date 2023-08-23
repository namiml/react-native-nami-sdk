//
//  Nami.m
//  RNNami
//
//  Copyright © 2020-2023 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"



@interface NamiBridge : NSObject <RCTBridgeModule>
@end
@implementation NamiBridge (RCTExternModule)

RCT_EXPORT_METHOD(configure: (NSDictionary *)configDict completion: (RCTResponseSenderBlock) completion) {
    if ([configDict count] == 0 || [configDict[@"logLevel"] isEqual: @"DEBUG"] ) {
        NSLog(@"Configure dictionary is %@", configDict);
    }
    NSString *appID = configDict[@"appPlatformID-apple"];

    if ([appID length] > 0 ) {
        NamiConfiguration *config = [NamiConfiguration configurationForAppPlatformId:appID];

        NSString *logLevelString = configDict[@"logLevel"];
        if ([logLevelString isEqualToString:@"ERROR" ]) {
            config.logLevel = NamiLogLevelError;
        } else if ([logLevelString isEqualToString:@"INFO" ]) {
            config.logLevel = NamiLogLevelInfo;
        } else if ([logLevelString isEqualToString:@"WARNING" ]) {
            config.logLevel = NamiLogLevelWarn;
        } else {
            // If they messed up the params, just set logging to full.
            config.logLevel = NamiLogLevelDebug;
        }

        NSString *languageString = configDict[@"namiLanguageCode"];
        if ([languageString length] > 0) {
            NSLog(@"Nami language code from config dictionary is %@", languageString);
            if  ([[NamiLanguageCodes allAvailableNamiLanguageCodes]
                  containsObject:[languageString lowercaseString]] ) {
              config.namiLanguageCode = languageString;
            } else {
                NSLog(@"Warning: Nami language code from config dictionary %@ not found in list of available Nami Language Codes:\n%@", languageString, [NamiLanguageCodes allAvailableNamiLanguageCodes]);
            }
        }

        // Start commands with header iformation for Nami to let them know this is a React client.
        NSMutableArray *namiCommandStrings = [NSMutableArray arrayWithArray:@[@"extendedClientInfo:react-native:3.0.29"]];

        // Add additional namiCommands app may have sent in.
        NSObject *appCommandStrings = configDict[@"namiCommands"];
        if ( appCommandStrings != NULL ) {
            NSLog(@"NamiCommand from dictionary is %@", configDict[@"namiCommands"]);
            if ([appCommandStrings isKindOfClass:[NSArray class]] ) {
                for (NSObject *commandObj in ((NSArray *)appCommandStrings)){
                    if ([commandObj isKindOfClass:[NSString class]]) {
                        [namiCommandStrings addObject:(NSString *)commandObj];
                    }
                }
            }
        }

        config.namiCommands = namiCommandStrings;

        NSString *initialConfigString = configDict[@"initialConfig"];
        if ([initialConfigString length] > 0) {
              NSLog(@"Found an initialConfig file to use for Nami SDK setup.");
              config.initialConfig = initialConfigString;
        }

        [Nami configureWith:config];
        NSDictionary *dict = @{@"success": @YES};
        completion(@[dict]);
    }
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
