//
//  NamiBridgeUtil.m
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import "NamiBridgeUtil.h"


@implementation NamiBridgeUtil : NSObject

    + (NSDictionary<NSString *,NSString *> *) productToProductDict:(NamiSKU *)product {
        NSMutableDictionary<NSString *,NSString *> *productDict = [NSMutableDictionary new];

        productDict[@"skuIdentifier"] = product.platformID;

        SKProduct *productInt = product.product;
        productDict[@"localizedTitle"] = productInt.localizedTitle;
        productDict[@"localizedDescription"] = productInt.localizedDescription;
        productDict[@"localizedPrice"] = productInt.localizedPrice;
        productDict[@"localizedMultipliedPrice"] = productInt.localizedMultipliedPrice;
        productDict[@"price"] = productInt.price.stringValue;
        productDict[@"priceLanguage"] = productInt.priceLocale.languageCode;
        productDict[@"priceCountry"] = productInt.priceLocale.countryCode;
        productDict[@"priceCurrency"] = productInt.priceLocale.currencyCode;

        if (@available(iOS 12.0, *)) {
            productDict[@"subscriptionGroupIdentifier"] = [NSString stringWithString:productInt.subscriptionGroupIdentifier];
        }

        if (@available(iOS 11.2, *)) {
            SKProductSubscriptionPeriod *subscriptionPeriod = productInt.subscriptionPeriod;

            if (subscriptionPeriod != NULL) {
                NSUInteger numberOfUnits = subscriptionPeriod.numberOfUnits;
                SKProductPeriodUnit periodUnit = subscriptionPeriod.unit;

                productDict[@"numberOfUnits"] = [NSString stringWithFormat:@"%lu", (unsigned long)numberOfUnits];
                productDict[@"periodUnit"] = [NSString stringWithFormat:@"%lu", (unsigned long)periodUnit];
            }
        }

        return productDict;
    }

 + (NSDictionary<NSString *,NSString *> *) purchaseToPurchaseDict:(NamiPurchase *)purchase {
     NSMutableDictionary<NSString *,id> *purchaseDict = [NSMutableDictionary new];
     
     purchaseDict[@"skuIdentifier"] = purchase.skuID;
     purchaseDict[@"transactionIdentifier"] = purchase.transactionIdentifier;
     purchaseDict[@"purchaseInitiatedTimestamp"] = [self javascriptDateFromNSDate:purchase.purchaseInitiatedTimestamp];
     
     NSDate *subscriptionExpirationDate = purchase.exipres;
     if (subscriptionExpirationDate != nil) {
         purchaseDict[@"subscriptionExpirationDate"] = [self javascriptDateFromNSDate:subscriptionExpirationDate];
     }
     
     purchaseDict[@"purchaseSource"] =  [[NSString alloc] initWithFormat:@"%d", (int)purchase.purchaseSource];
     
     return purchaseDict;
 }

+ (NSString *)javascriptDateFromNSDate:(NSDate *)purchseTimestamp {
    NSTimeZone *UTC = [NSTimeZone timeZoneWithAbbreviation: @"UTC"];
    NSISO8601DateFormatOptions options = NSISO8601DateFormatWithInternetDateTime | NSISO8601DateFormatWithDashSeparatorInDate | NSISO8601DateFormatWithColonSeparatorInTime | NSISO8601DateFormatWithTimeZone;
    
    return [NSISO8601DateFormatter stringFromDate:purchseTimestamp timeZone:UTC formatOptions:options];
}


@end
