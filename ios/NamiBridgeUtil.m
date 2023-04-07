//
//  NamiBridgeUtil.m
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020-2023 Nami ML Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NamiApple/NamiApple.h>

#import "NamiBridgeUtil.h"


@implementation NamiBridgeUtil : NSObject

    + (NSDictionary<NSString *,NSString *> *) skuToSKUDict:(NamiSKU *)sku {
        NSMutableDictionary<NSString *,NSString *> *productDict = [NSMutableDictionary new];

        productDict[@"skuIdentifier"] = sku.platformId;

        SKProduct *productInt = sku.product;
        productDict[@"localizedTitle"] = productInt.localizedTitle;
        productDict[@"localizedDescription"] = productInt.localizedDescription;
        productDict[@"localizedPrice"] = productInt.localizedPrice;
        productDict[@"localizedMultipliedPrice"] = productInt.localizedMultipliedPrice;
        productDict[@"price"] = productInt.price.stringValue;
        productDict[@"priceLanguage"] = productInt.priceLocale.languageCode;
        productDict[@"priceCountry"] = productInt.priceLocale.countryCode;
        productDict[@"priceCurrency"] = productInt.priceLocale.currencyCode;

        // Add smart text processed values for sku buttons to sku dictionary
        productDict[@"displayText"] = [sku localizedDisplayText];
        productDict[@"displaySubText"] = [sku localizedSubDisplayText];

        if (@available(iOS 12.0, *)) {
            if (productInt != nil && productInt.subscriptionGroupIdentifier != nil) {
                productDict[@"subscriptionGroupIdentifier"] = [NSString stringWithString:productInt.subscriptionGroupIdentifier];
            }
        }

        if (@available(iOS 11.2, *)) {
            SKProductSubscriptionPeriod *subscriptionPeriod = productInt.subscriptionPeriod;

            if (subscriptionPeriod != NULL) {
                NSUInteger numberOfUnits = subscriptionPeriod.numberOfUnits;
                SKProductPeriodUnit periodUnit = subscriptionPeriod.unit;
                NSString *convertedUnit = @"";
                switch (periodUnit) {
                    case SKProductPeriodUnitDay:
                        convertedUnit = @"day";
                        break;
                    case SKProductPeriodUnitWeek:
                        convertedUnit = @"week";
                        break;
                    case SKProductPeriodUnitMonth:
                        convertedUnit = @"month";
                        break;
                    case SKProductPeriodUnitYear:
                        convertedUnit = @"year";
                        break;
                }

                productDict[@"numberOfUnits"] = [NSString stringWithFormat:@"%lu", (unsigned long)numberOfUnits];
                productDict[@"periodUnit"] = convertedUnit;
            }
        }

        return productDict;
    }

 + (NSDictionary<NSString *,NSString *> *) purchaseToPurchaseDict:(NamiPurchase *)purchase {
     NSMutableDictionary<NSString *,id> *purchaseDict = [NSMutableDictionary new];

     purchaseDict[@"skuIdentifier"] = purchase.skuId;
     purchaseDict[@"transactionIdentifier"] = purchase.transactionIdentifier;

     // Removed, not sure why, should add back in when possible.
     //     purchaseDict[@"purchaseInitiatedTimestamp"] = [self javascriptDateFromNSDate:purchase.purchaseInitiatedTimestamp];

     NSDate *subscriptionExpirationDate = purchase.expires;
     if (subscriptionExpirationDate != nil) {
         purchaseDict[@"subscriptionExpirationDate"] = [self javascriptDateFromNSDate:subscriptionExpirationDate];
     }

     NSString *convertedSourceString = @"UNKNOWN";
     switch (purchase.purchaseSource) {
          case 0:
             convertedSourceString = @"EXTERNAL";
             break;
         case 1:
             convertedSourceString = @"NAMI_RULES";
             break;
         case 2:
             convertedSourceString = @"USER";
             break;
         default:
             break;
     }
     purchaseDict[@"purchaseSource"] =  convertedSourceString;

//     NamiSKU *purchaseSku = [purchase ]

     return purchaseDict;
 }


// Strip out presention_position from all listed sku items in the sku_ordered_metadata array
+ (NSArray *)stripPresentationPositionFromOrderedMetadataForPaywallMetaDict: (NSDictionary *)paywallMeta {
    NSArray *baseSkuArray = [paywallMeta objectForKey:@"sku_ordered_metadata"];
    NSMutableArray *newOrderedMetadata = [NSMutableArray new];

    if ( [baseSkuArray isKindOfClass:[NSArray class]] ) {
        for (NSDictionary *baseSkuDict in baseSkuArray) {
            NSMutableDictionary *skuFormattingDict = [NSMutableDictionary dictionaryWithDictionary:baseSkuDict];
            [skuFormattingDict removeObjectForKey:@"presentation_position"];
            [newOrderedMetadata addObject:skuFormattingDict];
        }
    }
    return newOrderedMetadata;
}

+ (NSDictionary<NSString *,NSString *> *) entitlementToEntitlementDict:(NamiEntitlement *)entitlement {
    NSMutableDictionary<NSString *,id> *entitlementDict = [NSMutableDictionary new];
    NSLog(@"Converting entitlement %@", entitlement);
    entitlementDict[@"referenceID"] = [entitlement referenceId];
    entitlementDict[@"namiID"] = [entitlement namiId] ? [entitlement namiId] : @"";
    entitlementDict[@"desc"] = [entitlement desc] ? [entitlement desc] : @"";
    entitlementDict[@"name"] = [entitlement name] ? [entitlement name] : @"";

    if (entitlementDict[@"referenceID"] == nil || [[entitlement referenceId] length] == 0) {
        NSLog(@"NamiBridge: Bad entitlement in system, empty referenceID.");
        return nil;
    }

    NSArray <NamiPurchase *>*activePurchases = [entitlement activePurchases];
    NSMutableArray *convertedActivePurchases = [NSMutableArray array];
    for (NamiPurchase *purchase in activePurchases) {
        NSDictionary *purchaseDict = [NamiBridgeUtil purchaseToPurchaseDict:purchase];
        if (purchaseDict != nil) {
            [convertedActivePurchases addObject:purchaseDict];
        }
    }
    entitlementDict[@"activePurchases"] = convertedActivePurchases;

    NSArray <NamiSKU *>*purchasedSKUs = [entitlement purchasedSkus];
       NSMutableArray *convertedPurchasedSKUs = [NSMutableArray array];
       for (NamiSKU *sku in purchasedSKUs) {
           NSDictionary *skuDict = [NamiBridgeUtil skuToSKUDict:sku];
           if (skuDict != nil) {
               [convertedPurchasedSKUs addObject:skuDict];
           }
       }
       entitlementDict[@"purchasedSKUs"] = convertedPurchasedSKUs;


    NSArray <NamiSKU *>*relatedSKUs = [entitlement relatedSkus];
    NSMutableArray *convertedRelatedSKUs = [NSMutableArray array];
    for (NamiSKU *sku in relatedSKUs) {
        NSDictionary *skuDict = [NamiBridgeUtil skuToSKUDict:sku];
        if (skuDict != nil) {
            [convertedRelatedSKUs addObject:skuDict];
        }
    }
    entitlementDict[@"relatedSKUs"] = convertedRelatedSKUs;

    NamiPurchase *lastPurchase;
    for (NamiPurchase *purchase in [entitlement activePurchases]) {
        if (lastPurchase == NULL || ([lastPurchase purchaseInitiatedTimestamp] < [purchase purchaseInitiatedTimestamp])) {
            lastPurchase = purchase;
        }
    }
    if (lastPurchase != NULL) {
//        entitlementDict[@"latestPurchase"] = [NamiBridgeUtil purchaseToPurchaseDict:lastPurchase];
    }

    NSString *lastPurchaseSKUID = [lastPurchase skuId];

    NamiSKU *lastPurchasedSKU;
    if (lastPurchaseSKUID != NULL ) {
        for (NamiSKU *sku in [entitlement purchasedSkus]) {
            if ( [[sku platformId] isEqualToString:lastPurchaseSKUID] ) {
                lastPurchasedSKU = sku;
            }
        }
    }

    if (lastPurchasedSKU != NULL) {
        lastPurchasedSKU = [[entitlement purchasedSkus] lastObject];
    }

    if (lastPurchasedSKU != NULL) {
//        entitlementDict[@"lastPurchasedSKU"] = [NamiBridgeUtil skuToSKUDict:lastPurchasedSKU];
    }

    return entitlementDict;
}



+ (NSString *)javascriptDateFromNSDate:(NSDate *)purchaseTimestamp {
    NSTimeZone *UTC = [NSTimeZone timeZoneWithAbbreviation: @"UTC"];
    NSISO8601DateFormatOptions options = NSISO8601DateFormatWithInternetDateTime | NSISO8601DateFormatWithDashSeparatorInDate | NSISO8601DateFormatWithColonSeparatorInTime | NSISO8601DateFormatWithTimeZone;

    return [NSISO8601DateFormatter stringFromDate:purchaseTimestamp timeZone:UTC formatOptions:options];
}


+ (NSDictionary<NSString *,NSString *> *) customerJourneyStateDict {
    CustomerJourneyState *journeyState = [NamiCustomerManager journeyState];

    BOOL formerSubscriber = [journeyState formerSubscriber];
    BOOL inGracePeriod = [journeyState inGracePeriod];
    BOOL inTrialPeriod = [journeyState inTrialPeriod];
    BOOL inIntroOfferPeriod = [journeyState inIntroOfferPeriod];

    BOOL isCancelled = [journeyState isCancelled];
    BOOL inPause = [journeyState inPause];
    BOOL inAccountHold = [journeyState inAccountHold];

    NSDictionary *journeyDict = @{@"formerSubscriber":@(formerSubscriber),
                                  @"inGracePeriod":@(inGracePeriod),
                                  @"inTrialPeriod":@(inTrialPeriod),
                                  @"inIntroOfferPeriod":@(inIntroOfferPeriod),
                                  @"isCancelled":@(isCancelled),
                                  @"inPause":@(inPause),
                                  @"inAccountHold":@(inAccountHold)
    };
    return journeyDict;
}

+ (NSDictionary<NSString *,NSString *> *) paywallStylingToPaywallStylingDict:(PaywallStyleData *)styling {
    NSMutableDictionary<NSString *,id> *stylingDict = [NSMutableDictionary new];
    if (styling != nil) {
        stylingDict[@"backgroundColor"] = [NamiBridgeUtil hexStringForColor: styling.backgroundColor];

        stylingDict[@"bodyFontSize"] = @(styling.bodyFontSize);
        stylingDict[@"bodyTextColor"] = [NamiBridgeUtil hexStringForColor: styling.bodyTextColor];
        stylingDict[@"bodyShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.bodyShadowColor];
        stylingDict[@"bodyShadowRadius"] = @(styling.bodyShadowRadius);

        stylingDict[@"titleFontSize"] = @(styling.titleFontSize);
        stylingDict[@"titleTextColor"] = [NamiBridgeUtil hexStringForColor: styling.titleTextColor];
        stylingDict[@"titleShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.titleShadowColor];
        stylingDict[@"titleShadowRadius"] = @(styling.titleShadowRadius);

        stylingDict[@"closeButtonFontSize"] = @(styling.closeButtonFontSize);
        stylingDict[@"closeButtonTextColor"] = [NamiBridgeUtil hexStringForColor: styling.closeButtonTextColor];
        stylingDict[@"closeButtonShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.closeButtonShadowColor];
        stylingDict[@"closeButtonShadowRadius"] = @(styling.closeButtonShadowRadius);

        stylingDict[@"bottomOverlayColor"] = [NamiBridgeUtil hexStringForColor: styling.bottomOverlayColor];
        stylingDict[@"bottomOverlayCornerRadius"] = @(styling.bottomOverlayCornerRadius);

        stylingDict[@"skuButtonColor"] = [NamiBridgeUtil hexStringForColor: styling.skuButtonColor];
        stylingDict[@"skuButtonTextColor"] = [NamiBridgeUtil hexStringForColor: styling.skuButtonTextColor];

        stylingDict[@"featuredSkusButtonColor"] = [NamiBridgeUtil hexStringForColor: styling.featuredSkuButtonColor];
        stylingDict[@"featuredSkusButtonTextColor"] = [NamiBridgeUtil hexStringForColor: styling.featuredSkuButtonTextColor];

        stylingDict[@"signinButtonFontSize"] = @(styling.signinButtonFontSize);
        stylingDict[@"signinButtonTextColor"] = [NamiBridgeUtil hexStringForColor: styling.signinButtonTextColor];
        stylingDict[@"signinButtonShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.signinButtonShadowColor];
        stylingDict[@"signinButtonShadowRadius"] = @(styling.signinButtonShadowRadius);

        stylingDict[@"restoreButtonFontSize"] = @(styling.restoreButtonFontSize);
        stylingDict[@"restoreButtonTextColor"] = [NamiBridgeUtil hexStringForColor: styling.restoreButtonTextColor];
        stylingDict[@"restoreButtonShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.restoreButtonShadowColor];
        stylingDict[@"restoreButtonShadowRadius"] = @(styling.restoreButtonShadowRadius);

        stylingDict[@"purchaseTermsFontSize"] = @(styling.purchaseTermsFontSize);
        stylingDict[@"purchaseTermsTextColor"] = [NamiBridgeUtil hexStringForColor: styling.purchaseTermsTextColor];
        stylingDict[@"purchaseTermsShadowColor"] = [NamiBridgeUtil hexStringForColor: styling.purchaseTermsShadowColor];
        stylingDict[@"purchaseTermsShadowRadius"] = @(styling.purchaseTermsShadowRadius);


        stylingDict[@"termsLinkColor"] = styling.termsLinkColor;
    }

    return stylingDict;
}

+ (NSString *)hexStringForColor:(UIColor *)color {
    CGFloat r;
    CGFloat g;
    CGFloat b;
    CGFloat a;
    [color getRed:&r green:&g blue:&b alpha:&a];
    NSString *hexString=[NSString stringWithFormat:@"#%02X%02X%02X", (int)(r * 255), (int)(g * 255), (int)(b * 255)];
    return hexString;
}

@end
