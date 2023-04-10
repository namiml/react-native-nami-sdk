//
//  NamiPaywallManager.m
//  namiReactNative
//
//  Created by Kendall Gelner on 11/22/19.
//  Copyright © 2019 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>
#import "NamiBridgeUtil.h"

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"

@interface NamiEmitter : RCTEventEmitter
- (void)sendEventPreparePaywallForDisplayFinishedWithResult:(BOOL)success developerPaywallID: (NSString * _Nullable) developerPaywallID error:(NSError * _Nullable) error;
+ (NamiEmitter *) reactInstance;
@end

@interface NamiPaywallManagerBridge : NSObject <RCTBridgeModule>
@property (atomic) BOOL blockPaywallRaise;
@end


@implementation NamiPaywallManagerBridge (RCTExternModule)

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setBlockPaywallRaise:false];
        [NamiPaywallManager renderCustomUiHandler:^(NSArray<NamiSKU *> * _Nullable products, NamiPaywall * _Nullable paywallMetadata) {
            NSLog(@"Block paywall raise set to %d", [self blockPaywallRaise]);
        }];        
    }
    return self;
}

RCT_EXTERN_METHOD(raisePaywall)
- (void)raisePaywall {
    [NamiCampaignManager launch];
}

RCT_EXPORT_METHOD(raisePaywallByDeveloperPaywallId)
{
    [NamiCampaignManager launch];
}

RCT_EXPORT_METHOD(blockPaywallRaise:(BOOL)blockRaise)
{
    [self setBlockPaywallRaise:blockRaise];
}

RCT_EXPORT_METHOD(presentNamiPaywall:(NSArray *)skuIDs metapaywallDefinition:(NSDictionary *)paywallDict)
{
    NSString *paywallDeveloperID = paywallDict[@"developerPaywallID"];
    if ( paywallDeveloperID != nil ) {        
        [NamiPaywallManager renderCustomUiHandler:nil];
    } else {
        // No way to handle this case for now as we cannot cretae a NamiMetaPaywall
    }
}

RCT_EXPORT_METHOD(processSmartTextForProducts:(NSString *)smartText  skuIDs:(NSArray<NSString *> *)skuIDs completion:(RCTResponseSenderBlock)completion)
{
    [NamiPurchaseManager skusForSKUIdsWithSkuIds:skuIDs productHandler:^(BOOL success, NSArray<NamiSKU *> * _Nullable skus, NSArray<NSString *> * _Nullable invalidSkuIDs, NSError * _Nullable error) {
        if (skus != NULL) {
            // Found some of the skus they were looking for, process text
            NSString *processedText = [NamiPaywallManager processSmartTextWithText:smartText dataStores:skus];
            completion(@[processedText]);
        } else {
            // No products found so cannot process smart text, just send back.
            completion(@[smartText]);
        }
    }];
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
