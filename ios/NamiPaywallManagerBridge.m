//
//  NamiPaywallManager.m
//  namiReactNative
//
//  Created by Kendall Gelner on 11/22/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"



@interface NamiPaywallManagerBridge : NSObject <RCTBridgeModule>
@property (atomic) BOOL blockPaywallRaise;
@end


@implementation NamiPaywallManagerBridge (RCTExternModule)

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setBlockPaywallRaise:false];
        [NamiPaywallManager registerApplicationAutoRaisePaywallBlocker:^BOOL{
            NSLog(@"Block paywall raise set to %d", [self blockPaywallRaise]);
            return ![self blockPaywallRaise];
        }];
    }
    return self;
}

RCT_EXTERN_METHOD(raisePaywall)
- (void)raisePaywall {
  [NamiPaywallManager raisePaywallFromVC:nil];
}

RCT_EXPORT_METHOD(blockPaywallRaise:(BOOL)blockRaise)
{
    [self setBlockPaywallRaise:blockRaise];
}

RCT_EXPORT_METHOD(canRaisePaywall:(RCTResponseSenderBlock)completion)
{
    BOOL canRaise = [NamiPaywallManager canRaisePaywall];
    completion(@[[NSNumber numberWithBool:canRaise]]);
}

RCT_EXPORT_METHOD(presentNamiPaywall:(NSArray *)skuIDs metapaywallDefinition:(NSDictionary *)paywallDict)
{
    NSString *paywallDeveloperID = paywallDict[@"developerPaywallID"];
    if ( paywallDeveloperID != nil ) {
        [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:paywallDeveloperID :^(NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull paywallDevloperID, NamiPaywall * _Nullable namiMetaPaywall) {
            [NamiPaywallManager presentNamiPaywallFromVC:nil products:products paywallMetadata:namiMetaPaywall backgroundImage:namiMetaPaywall.backgroundImage forNami:false];
        }];
    } else {
        // No way to handle this case for now as we cannot cretae a NamiMetaPaywall
    }
}

RCT_EXPORT_METHOD(fetchCustomPaywallMetaForDeveloperID:(NSString *)developerPaywallID completion:(RCTResponseSenderBlock)completion)
{
    [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:developerPaywallID :^(NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nullable paywallMetadata) {
        NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
        for (NamiSKU *product in products) {
          [productDicts addObject:[NamiBridgeUtil skuToSKUDict:product]];
        }
        NSArray *wrapperArray = @[@{ @"products": productDicts,
                                                                @"developerPaywallID": developerPaywallID,
                                                                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
        completion(wrapperArray);
    }];
}


RCT_EXPORT_METHOD(paywallImpression:(NSString *)developerPaywallID)
{
    [NamiPaywallManager paywallImpressionWithDeveloperID:developerPaywallID];
}


@end

@implementation NamiPaywallManagerBridge
RCT_EXPORT_MODULE_NO_LOAD(NamiPaywallManagerBridge, NamiPaywallManagerBridge)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}



@end
