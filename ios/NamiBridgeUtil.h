//
//  NamiBridgeUtil.h
//  RNNami
//
//  Copyright © 2020-2023 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>

#ifndef NamiBridgeUtil_h
#define NamiBridgeUtil_h

@interface NamiBridgeUtil : NSObject
// Converts NamiMetaProduct into javascript compatible dictionary
+ (NSDictionary<NSString *,NSString *> *) skuToSKUDict:(NamiSKU *)product;

// Converts NamiMetaPurchase into javascript compatible dictionary
+ (NSDictionary<NSString *,NSString *> *) purchaseToPurchaseDict:(NamiPurchase *)purchase;

// Converts NSDate into javascript convertable (UTC) string
+ (NSString *)javascriptDateFromNSDate:(NSDate *)purchseTimestamp;

+ (NSDictionary<NSString *,NSString *> *) entitlementToEntitlementDict:(NamiEntitlement *)entitlement;

+ (NSArray *)stripPresentationPositionFromOrderedMetadataForPaywallMetaDict: (NSDictionary *)paywallMeta;

+ (NSDictionary<NSString *,NSString *> *) customerJourneyStateDict;

@end

#endif /* NamiBridgeUtil_h */
