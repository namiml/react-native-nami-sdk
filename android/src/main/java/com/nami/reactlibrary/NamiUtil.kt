package com.nami.reactlibrary

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.namiml.api.model.NamiPaywall
import com.namiml.billing.NamiPurchase
import com.namiml.paywall.NamiSKU
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

fun paywallToPaywallDict(paywallData: NamiPaywall): WritableMap {

    val paywallMap: WritableMap = Arguments.createMap()
    paywallMap.putString("title", paywallData.title ?: "")
    paywallMap.putString("body", paywallData.body ?: "")

    val marketingContentMap = Arguments.createMap()
    marketingContentMap.putString("title", paywallData.title ?: "")
    marketingContentMap.putString("body", paywallData.body ?: "")
    paywallMap.putMap("marketing_content", marketingContentMap)

    paywallMap.putString("id", paywallData.id ?: "")
    paywallMap.putString("background_image_url_phone", paywallData.backgroundImageUrlPhone ?: "")
    paywallMap.putString("background_image_url_tablet", paywallData.backgroundImageUrlTablet ?: "")
    paywallMap.putString("privacy_policy", paywallData.privacyPolicy ?: "")
    paywallMap.putString("purchase_terms", paywallData.purchaseTerms ?: "")
    paywallMap.putString("tos_link", paywallData.tosLink ?: "")
    val allowClosingStr = if (paywallData.allowClosing) "true" else "false"
    paywallMap.putString("allow_closing", allowClosingStr)

    return paywallMap
}


fun skuToSkuDict(namiSKU: NamiSKU): WritableMap {
    val productDict = Arguments.createMap()

    productDict.putString("skuIdentifier", namiSKU.product)
    productDict.putString("localizedTitle", namiSKU.skuName)
    productDict.putString("localizedDescription", namiSKU.localizedDescription)
    productDict.putString("localizedPrice", namiSKU.localizedPrice)
    productDict.putString("localizedMultipliedPrice", namiSKU.localizedMultipliedPrice)
    productDict.putString("price", namiSKU.price.toBigDecimal().toPlainString())
    productDict.putString("priceLanguage", namiSKU.priceLanguage)
    productDict.putString("priceCountry", namiSKU.priceCountry)
    productDict.putString("priceCurrency", namiSKU.priceCurrency)
    productDict.putString("numberOfUnits", namiSKU.numberOfUnits.toString())
    productDict.putString("periodUnit", namiSKU.periodUnit.toString())

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun purchaseToPurchaseDict(purchase: NamiPurchase): WritableMap {
    val purchaseMap = WritableNativeMap()

    purchaseMap.putString("localizedDescription", purchase.localizedDescription ?: "")
    purchaseMap.putString("source", purchase.source ?: "")
    purchaseMap.putString("transactionIdentifier", purchase.transactionIdentifier ?: "")
    val expires = purchase.expires
    expires?.let {
        purchaseMap.putString("expires", javascriptDateFromKJavaDate(expires))
    }
    purchaseMap.putBoolean("fromNami", purchase.fromNami)

    // TODO: map kotlin dictionary into arbitrary map?
    purchaseMap.putMap("platformMetadata",  WritableNativeMap())

    var purchasedSkuMap: WritableMap = WritableNativeMap()
    val purchasedSKU = purchase.purchasedSKU
    purchasedSKU?.let {
        purchasedSkuMap = skuToSkuDict(purchasedSKU)
    }
    purchaseMap.putMap("purchasedSku", purchasedSkuMap)

    return purchaseMap
}

// Convert Java Date to ISO860 UTC date to pass to Javascript
fun javascriptDateFromKJavaDate(date: Date): String {
    val tz = TimeZone.getTimeZone("UTC")
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'")
    df.setTimeZone(tz)
    return df.format(date)
}