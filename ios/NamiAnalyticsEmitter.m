//
//  NamiAnalyticsEmitter.m
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>


#import <Nami/Nami.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#import "React/RCTViewManager.h"
#import <UIKit/UIKit.h>

#import "NamiBridgeUtil.h"


@interface RCT_EXTERN_MODULE(NamiAnalyticsEmitter, RCTEventEmitter)
RCT_EXTERN_METHOD(allPurchasedProducts)
RCT_EXTERN_METHOD(getPurchasedProducts: (RCTResponseSenderBlock)callback)
@end

@implementation NamiAnalyticsEmitter : RCTEventEmitter

- (instancetype)init
{
  self = [super init];
  if (self) {
    hasListeners = NO;
    
      [NamiAnalyticsSupport registerAnalyticsHandlerWithHandler: ^(NamiAnalyticsActionType actionType , NSDictionary<NSString *,id> * _Nonnull anaytlicsDict) {
          [self sendAnalyticsEventForAction:actionType anayticsItems:anaytlicsDict];
      }];
      
    // Tell Nami to listen for purchases and we'll forward them on to listeners
  }
  
  return self;
}

- (void) getPurchasedProducts : (RCTResponseSenderBlock) callback  {
  NSArray *allProducts = [self allPurchasedProducts];
  callback(allProducts);
}

- (NSArray<NSString *> *)allPurchasedProducts {
  NSArray<NamiMetaPurchase *> *purchases = NamiStoreKitHelper.shared.allPurchasedProducts;
  NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
  for (NamiMetaProduct *purchase in purchases) {
    [productIDs addObject:purchase.productIdentifier];
  }

  return productIDs;
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

bool hasListeners;

// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

- (void)sendAnalyticsEventForAction:(NamiAnalyticsActionType)action
                      anayticsItems:(NSDictionary *)anayticsItems {
  if (hasListeners) {
      NSDictionary *sendAnalyitcsDict = [self sanitizeAnalyticsItems:anayticsItems];
    
      NSString *actionName = @"UNKNOWN";
      switch (action) {
          case NamiAnalyticsActionTypePaywallRaise:
              actionName = @"paywall_raise";
              break;
          case NamiAnalyticsActionTypePaywallClosed:
              actionName = @"paywall_closed";
              break;
          case NamiAnalyticsActionTypePaywallRaiseBlocked:
              actionName = @"paywall_raise_blocked";
              break;
          case NamiAnalyticsActionTypePurchaseActivity:
              actionName = @"purchase_activity";
              break;
      }
      
      [self sendEventWithName:@"NamiAnalyticsSent" body:@{@"actionType" : actionName, @"analyticsItems": sendAnalyitcsDict}];
  }
}


- (NSDictionary *) productDictIfProductPresentInAnalyticsItems:(NSDictionary *)anayticsItems forKey:(NSString *)key {
    NamiMetaProduct *product = (NamiMetaProduct *)anayticsItems[key];
    if (product != NULL && [product isKindOfClass:[NamiMetaProduct class]] ) {
        return [NamiBridgeUtil productToProductDict:product];
    } else {
        return NULL;
    }
}



- (NSDictionary <NSString *, id> *) sanitizeAnalyticsItems:(NSDictionary *)anayticsItems {
    NSMutableDictionary<NSString *, id> *sanitizedDictionary = [NSMutableDictionary dictionaryWithDictionary:anayticsItems];
    
    id rawProducts = anayticsItems[@"paywallProducts"];
    if ([rawProducts isKindOfClass:[NSArray class]]) {
        NSMutableArray<NSDictionary *> *productsSanitized = [NSMutableArray new];
        for (NamiMetaProduct *product in (NSArray *)rawProducts) {
            [productsSanitized addObject:[NamiBridgeUtil productToProductDict:product]];
        }
        sanitizedDictionary[@"paywallProducts_NamiMetaProduct"] = productsSanitized;
    }


    NSDate *purchseTimestamp = (NSDate *)(anayticsItems[@"purchasedProductPurchaseTimestamp_Date"]);
    if (purchseTimestamp != NULL && [purchseTimestamp isKindOfClass:[NSDate class]])
    {
        NSTimeZone *UTC = [NSTimeZone timeZoneWithAbbreviation: @"UTC"];
        NSISO8601DateFormatOptions options = NSISO8601DateFormatWithInternetDateTime | NSISO8601DateFormatWithDashSeparatorInDate | NSISO8601DateFormatWithColonSeparatorInTime | NSISO8601DateFormatWithTimeZone;
        
        sanitizedDictionary[@"purchasedProductPurchaseTimestamp_Date"] =  [NSISO8601DateFormatter stringFromDate:purchseTimestamp timeZone:UTC formatOptions:options];
    }
    
    NSDictionary *purchasedProductDict = [self productDictIfProductPresentInAnalyticsItems:anayticsItems forKey:@"purchasedProduct_NamiMetaProduct"];
    if ( purchasedProductDict != NULL ) {
        sanitizedDictionary[@"purchasedProduct_NamiMetaProduct"] = purchasedProductDict;
        sanitizedDictionary[@"purchasedProductPrice"] = purchasedProductDict[@"price"];
        sanitizedDictionary[@"purchasedProductLocale"] = purchasedProductDict[@"priceLocale"];
    }
    
    NSNumber *activityType = anayticsItems[@"purchaseActivityType_ActivityType"];
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
