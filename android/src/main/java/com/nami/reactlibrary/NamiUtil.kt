package com.nami.reactlibrary

import com.namiml.api.model.SKU
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*


//+ (NSDictionary<NSString *,NSString *> *) productToProductDict:(NamiMetaProduct *)product {
//    NSMutableDictionary<NSString *,NSString *> *productDict = [NSMutableDictionary new];
//
//    productDict[@"productIdentifier"] = product.productIdentifier;
//
//    SKProduct *productInt = product.product;
//    productDict[@"localizedTitle"] = productInt.localizedTitle;
//    productDict[@"localizedDescription"] = productInt.localizedDescription;
//    productDict[@"localizedPrice"] = productInt.localizedPrice;
//    productDict[@"localizedMultipliedPrice"] = productInt.localizedMultipliedPrice;
//    productDict[@"price"] = productInt.price.stringValue;
//    productDict[@"priceLanguage"] = productInt.priceLocale.languageCode;
//    productDict[@"priceCountry"] = productInt.priceLocale.countryCode;
//    productDict[@"priceCurrency"] = productInt.priceLocale.currencyCode;
//
//    if (@available(iOS 12.0, *)) {
//        productDict[@"subscriptionGroupIdentifier"] = [NSString stringWithString:productInt.subscriptionGroupIdentifier];
//    }
//
//    if (@available(iOS 11.2, *)) {
//        SKProductSubscriptionPeriod *subscriptionPeriod = productInt.subscriptionPeriod;
//
//        if (subscriptionPeriod != NULL) {
//            NSUInteger numberOfUnits = subscriptionPeriod.numberOfUnits;
//            SKProductPeriodUnit periodUnit = subscriptionPeriod.unit;
//
//            productDict[@"numberOfUnits"] = [NSString stringWithFormat:@"%lu", (unsigned long)numberOfUnits];
//            productDict[@"periodUnit"] = [NSString stringWithFormat:@"%lu", (unsigned long)periodUnit];
//        }
//    }
//
//    return productDict;
//}

fun productToProductDict( sku: SKU) : Map<String,String> {
    var productDict = mutableMapOf<String, String>()

    productDict["skuPlatformIdentifier"] = product.productIdentifier

    productDict["localizedTitle"] = sku.name
//    productDict["localizedDescription"] = sku.
//    productDict["localizedPrice"] = sku.
//    productDict["localizedMultipliedPrice"] = productInt.localizedMultipliedPrice;
//    productDict["price"] = productInt.price.stringValue;
//    productDict["priceLanguage"] = productInt.priceLocale.languageCode;
//    productDict["priceCountry"] = productInt.priceLocale.countryCode;
//    productDict["priceCurrency"] = productInt.priceLocale.currencyCode;
//    productDict["numberOfUnits"] = [NSString stringWithFormat:@"%lu", (unsigned long)numberOfUnits];
//    productDict["periodUnit"] = [NSString stringWithFormat:@"%lu", (unsigned long)periodUnit];

    return productDict
}

//+ (NSDictionary<NSString *,NSString *> *) purchaseToPurchaseDict:(NamiMetaPurchase *)purchase {
//    NSMutableDictionary<NSString *,id> *purchaseDict = [NSMutableDictionary new];
//
//    purchaseDict[@"productIdentifier"] = purchase.productIdentifier;
//    purchaseDict[@"transactionIdentifier"] = purchase.transactionIdentifier;
//    purchaseDict[@"purchaseInitiatedTimestamp"] = [self javascriptDateFromNSDate:purchase.purchaseInitiatedTimestamp];
//    purchaseDict[@"isSubscription"] = purchase.isSubscription ? @"true" : @"false";
//
//    NSDate *subscriptionExpirationDate = purchase.subscriptionExpirationDate;
//    if (subscriptionExpirationDate != nil) {
//        purchaseDict[@"subscriptionExpirationDate"] = [self javascriptDateFromNSDate:subscriptionExpirationDate];
//    }
//
//    purchaseDict[@"purchaseSource"] =  [[NSString alloc] initWithFormat:@"%d", (int)purchase.purchaseSource];
//
//    NamiMetaProduct *product = purchase.metaProduct;
//    if (product != nil) {
//        purchaseDict[@"metaProduct"] = [self productToProductDict:product];
//    }
//
//    return purchaseDict;
//}


// Really needs to be a NamiPurchase, when exists...
fun purchaseToPurchaseDict( sku: SKU ): Map<String,String> {

    return HashMap<String,String>()
}

// Convert Java Date to ISO860 UTC date to pass to Javascript
fun javascriptDateFromKJavaDate( date: Date): String {
    val tz = TimeZone.getTimeZone("UTC")
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'")
    df.setTimeZone(tz)
    return df.format(date)
}