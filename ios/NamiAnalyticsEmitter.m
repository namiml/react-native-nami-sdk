//
//  NamiAnalyticsEmitter.m
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>


#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"
#import <UIKit/UIKit.h>

#import "NamiBridgeUtil.h"

@interface RCT_EXTERN_MODULE(NamiAnalyticsEmitter, RCTEventEmitter)
@end

@implementation NamiAnalyticsEmitter : RCTEventEmitter

- (instancetype)init
{
    self = [super init];
    if (self) {
        hasNamiAanlyticsEmitterListeners = NO;
        
        [NamiAnalyticsSupport registerAnalyticsHandlerWithHandler: ^(NamiAnalyticsActionType actionType , NSDictionary<NSString *,id> * _Nonnull anaytlicsDict) {
            [self sendAnalyticsEventForAction:actionType anayticsItems:anaytlicsDict];
        }];
    }

  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"NamiAnalyticsSent" ];
}

- (NSDictionary<NSString *, NSObject *> *)constantsToExport {
  return @{};
}

bool hasNamiAanlyticsEmitterListeners;

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasNamiAanlyticsEmitterListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasNamiAanlyticsEmitterListeners = NO;
}

- (void)sendAnalyticsEventForAction:(NamiAnalyticsActionType)action
                      anayticsItems:(NSDictionary *)anayticsItems {
  if (hasNamiAanlyticsEmitterListeners) {
      NSDictionary *sendAnalyitcsDict = [self sanitizeAnalyticsItems:anayticsItems];

      NSString *actionName = @"UNKNOWN";
      switch (action) {
          case NamiAnalyticsActionTypePaywallRaise:
              actionName = @"paywall_raise";
              break;
          case NamiAnalyticsActionTypePurchaseActivity:
              actionName = @"purchase_activity";
              break;
      }

      [self sendEventWithName:@"NamiAnalyticsSent" body:@{@"actionType" : actionName, @"analyticsItems": sendAnalyitcsDict}];
  }
}


- (NSDictionary *) productDictIfProductPresentInAnalyticsItems:(NSDictionary *)anayticsItems forKey:(NSString *)key {
    NamiSKU *product = (NamiSKU *)anayticsItems[key];
    if (product != NULL && [product isKindOfClass:[NamiSKU class]] ) {
        return [NamiBridgeUtil skuToSKUDict:product];
    } else {
        return NULL;
    }
}



- (NSDictionary <NSString *, id> *) sanitizeAnalyticsItems:(NSDictionary *)anayticsItems {
    NSMutableDictionary<NSString *, id> *sanitizedDictionary = [NSMutableDictionary dictionaryWithDictionary:anayticsItems];

    id rawProducts = anayticsItems[@"paywallProducts"];
    if ([rawProducts isKindOfClass:[NSArray class]]) {
        NSMutableArray<NSDictionary *> *productsSanitized = [NSMutableArray new];
        for (NamiSKU *product in (NSArray *)rawProducts) {
            [productsSanitized addObject:[NamiBridgeUtil skuToSKUDict:product]];
        }
        sanitizedDictionary[@"paywallProducts"] = productsSanitized;
    }


    NSDate *purchseTimestamp = (NSDate *)(anayticsItems[@"purchasedProductPurchaseTimestamp"]);
    if (purchseTimestamp != NULL && [purchseTimestamp isKindOfClass:[NSDate class]])
    {
        sanitizedDictionary[@"purchasedProductPurchaseTimestamp"] = [NamiBridgeUtil javascriptDateFromNSDate:purchseTimestamp];
    }

    NSDictionary *purchasedProductDict = [self productDictIfProductPresentInAnalyticsItems:anayticsItems forKey:@"purchasedProduct"];
    if ( purchasedProductDict != NULL ) {
        sanitizedDictionary[@"purchasedProduct"] = purchasedProductDict;
        sanitizedDictionary[@"purchasedProductPrice"] = purchasedProductDict[@"price"];
        sanitizedDictionary[@"purchasedProductLocale"] = purchasedProductDict[@"priceLocale"];
    }

    NSNumber *activityType = anayticsItems[@"purchaseActivityType"];
    if (activityType != NULL && [activityType isKindOfClass:[NSNumber class]] ) {
        switch (activityType.intValue) {
            case 0: //newPurchase
                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"newPurchase";
                break;
            case 1: // cancelled
                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"cancelled";
                break;
            case 2: // resubscribe
                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"resubscribe";
                break;
            case 3: // restored
                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"restored";
                break;
            default:
                break;
        }
    }

    return sanitizedDictionary;
}


@end
