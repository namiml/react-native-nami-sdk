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

//  Didn't found new API
//RCT_EXTERN_METHOD(raisePaywall)
//- (void)raisePaywall {
//  [NamiPaywallManager raisePaywallFromVC:nil];
//}

//    Didn't found new API
//RCT_EXPORT_METHOD(raisePaywallByDeveloperPaywallId:(NSString * _Nonnull) developerPaywallID)
//{
//    [NamiPaywallManager raisePaywallWithDeveloperPaywallID:developerPaywallID fromVC:nil];
//}

RCT_EXPORT_METHOD(blockPaywallRaise:(BOOL)blockRaise)
{
    [self setBlockPaywallRaise:blockRaise];
}

//    Didn't found new API
//RCT_EXPORT_METHOD(canRaisePaywall:(RCTResponseSenderBlock)completion)
//{
//    BOOL canRaise = [NamiPaywallManager canRaisePaywall];
//    completion(@[[NSNumber numberWithBool:canRaise]]);
//}


RCT_EXPORT_METHOD(presentNamiPaywall:(NSArray *)skuIDs metapaywallDefinition:(NSDictionary *)paywallDict)
{
    NSString *paywallDeveloperID = paywallDict[@"developerPaywallID"];
    if ( paywallDeveloperID != nil ) {        
        [NamiPaywallManager renderCustomUiHandler:nil];
    } else {
        // No way to handle this case for now as we cannot cretae a NamiMetaPaywall
    }
}

//    Didn't found new API
//RCT_EXPORT_METHOD(fetchCustomPaywallMetaForDeveloperID:(NSString *)developerPaywallID completion:(RCTResponseSenderBlock)completion)
//{
//    [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:developerPaywallID :^(NSArray<NamiSKU *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiPaywall * _Nullable paywallMetadata) {
//        NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
//        for (NamiSKU *product in products) {
//          [productDicts addObject:[NamiBridgeUtil skuToSKUDict:product]];
//        }
//
//        NSMutableDictionary *paywallMeta = [NSMutableDictionary dictionaryWithDictionary:paywallMetadata.namiPaywallInfoDict];
//        // This part is really meant to be internally facing, scrub from dictionary
//        // Strip out presention_position from all listed sku items
//        NSArray *cleanedOrderdMetadata = [NamiBridgeUtil stripPresentationPositionFromOrderedMetadataForPaywallMetaDict:paywallMeta];
//        [paywallMeta setObject:cleanedOrderdMetadata  forKey:@"formatted_skus"];
//
//        [paywallMeta removeObjectForKey:@"sku_ordered_metadata"];
//        [paywallMeta removeObjectForKey:@"skus"];
//
//        NSDictionary *paywallStylingDict = [NamiBridgeUtil paywallStylingToPaywallStylingDict:[paywallMetadata styleData]];
//        paywallMeta[@"styleData"] = paywallStylingDict;
//
//
//        NSArray *wrapperArray = @[@{ @"namiSkus": productDicts,
//                                     @"developerPaywallID": developerPaywallID,
//                                     @"paywallMetadata": paywallMeta }];
//        completion(wrapperArray);
//    }];
//}

//    Didn't found new API
//RCT_EXPORT_METHOD(paywallImpression:(NSString *)developerPaywallID)
//{
//    [NamiPaywallManager paywallImpressionWithDeveloperID:developerPaywallID];
//}

//    Didn't found new API
//RCT_EXPORT_METHOD( preparePaywallForDisplay:(BOOL)backgroundImageRequired
//    imageFetchTimeout:(double)imageFetchTimeout )
//{
//    [NamiPaywallManager preparePaywallForDisplayWithBackgroundImageRequired:backgroundImageRequired imageFetchTimeout:imageFetchTimeout prepareHandler:^(BOOL success, NSError * _Nullable error) {
//        [[NamiEmitter reactInstance] sendEventPreparePaywallForDisplayFinishedWithResult:success developerPaywallID:nil error:error];
//    }];
//}

//    Didn't found new API
//RCT_EXPORT_METHOD(preparePaywallForDisplayByDeveloperPaywallId:(NSString *)developerPaywallID
//    backgroundImageRequired: (BOOL)backgroundImageRequired
//    imageFetchTimeout:(double)imageFetchTimeout )
//{
//    [NamiPaywallManager preparePaywallForDisplayWithDeveloperPaywallID:developerPaywallID backgroundImageRequired:backgroundImageRequired imageFetchTimeout:imageFetchTimeout prepareHandler:^(BOOL success, NSError * _Nullable error) {
//        [[NamiEmitter reactInstance] sendEventPreparePaywallForDisplayFinishedWithResult:success developerPaywallID:developerPaywallID error:error];
//    }];
//}


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
