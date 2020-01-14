//
//  NamiBridgeUtil.m
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <Nami/Nami.h>

#import "NamiBridgeUtil.h"


@implementation NamiBridgeUtil : NSObject

    + (NSDictionary<NSString *,NSString *> *) productToProductDict:(NamiMetaProduct *)product {
        NSMutableDictionary<NSString *,NSString *> *productDict = [NSMutableDictionary new];
        
        productDict[@"productIdentifier"] = product.productIdentifier;

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

@end
