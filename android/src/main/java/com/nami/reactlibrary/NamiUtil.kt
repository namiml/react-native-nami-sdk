package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.paywall.NamiPaywall
import com.namiml.billing.NamiPurchase
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiSKU
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.HashMap

import java.time.*

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

    val extraDataMap = paywallData.extraData
    if (extraDataMap != null) {
        val convertedMap = convertNativeMapBecauseReact(extraDataMap)
        marketingContentMap.putMap("extra_data", convertedMap)
    }

    paywallMap.putMap("marketing_content", marketingContentMap)

    Log.i("NamiBridge", "extraData items are " + extraDataMap)
    paywallMap.putString("id", paywallData.id)
    paywallMap.putString("background_image_url_phone", paywallData.backgroundImageUrlPhone ?: "")
    paywallMap.putString("background_image_url_tablet", paywallData.backgroundImageUrlTablet ?: "")
    paywallMap.putString("privacy_policy", paywallData.privacyPolicy ?: "")
    paywallMap.putString("purchase_terms", paywallData.purchaseTerms ?: "")
    paywallMap.putString("tos_link", paywallData.tosLink ?: "")
    paywallMap.putString("name", paywallData.name ?: "")
    paywallMap.putString("cta_type", paywallData.type ?: "")
//    paywallMap.putString("developer_paywall_id", paywallData.developerPaywallId ?: "")

    val allowClosing = paywallData.allowClosing
    paywallMap.putBoolean("allow_closing", allowClosing)

    val restoreControl = paywallData.restoreControl
    paywallMap.putBoolean("restore_control", restoreControl)

    val signInControl = paywallData.signInControl
    paywallMap.putBoolean("sign_in_control", signInControl)

    return paywallMap
}

fun convertNativeArrayBecauseReact(nativeList: List<*>): WritableArray {
    val convertedArray = Arguments.createArray()
    for (value in nativeList) {
        if (value is String) {
            convertedArray.pushString(value)
        } else if (value is Int) {
            convertedArray.pushInt(value)
        } else if (value is Boolean) {
            convertedArray.pushBoolean(value)
        } else if (value is Double) {
            convertedArray.pushDouble(value)
        } else if (value is List<*>) {
            val convertedArray = convertNativeArrayBecauseReact(value)
            convertedArray.pushArray(convertedArray)
        } else if (value is Map<*, *>) {
            val convertedMap = convertNativeMapBecauseReact(value)
            convertedArray.pushMap(convertedMap)
        }
    }
    return convertedArray
}


// React hasa  method makeNativeMap that doesn't work, as per react standards.  Buuld our own primitive mapper to make up for react shortcomings.
fun convertNativeMapBecauseReact(nativeMap: Map<*, *>): WritableMap {
    val convertedMap = Arguments.createMap()
    for ((key, value) in nativeMap) {
        if (key is String) {
            if (value is String) {
                convertedMap.putString(key, value)
            } else if (value is Int) {
                convertedMap.putInt(key, value)
            } else if (value is Boolean) {
                convertedMap.putBoolean(key, value)
            } else if (value is Double) {
                convertedMap.putDouble(key, value)
            } else if (value is List<*>) {
                val convertedArray = convertNativeArrayBecauseReact(value)
                convertedMap.putArray(key, convertedArray)
            } else if (value is Map<*, *>) {
                val convertedMap = convertNativeMapBecauseReact(value)
                convertedMap.putMap(key, convertedMap)
            }
        }
    }
    return convertedMap
}


fun skuToSkuDict(namiSKU: NamiSKU): WritableMap {
    val productDict = Arguments.createMap()

    productDict.putString("skuIdentifier", namiSKU.skuId)
    productDict.putString("localizedTitle", namiSKU.skuName)
    productDict.putString("localizedDescription", namiSKU.localizedDescription)
    productDict.putString("localizedPrice", namiSKU.localizedPrice)
    productDict.putString("localizedMultipliedPrice", namiSKU.localizedMultipliedPrice)
    productDict.putString("price", namiSKU.price.toBigDecimal().toPlainString())
    productDict.putString("priceLanguage", namiSKU.priceLanguage)
    productDict.putString("priceCountry", namiSKU.priceCountry)
    productDict.putString("priceCurrency", namiSKU.priceCurrency)
    productDict.putString("numberOfUnits", namiSKU.numberOfUnits.toString())
    val periodUnit = namiSKU.subscriptionIntervalLabel
    if (periodUnit != null) {
        productDict.putString("periodUnit", periodUnit)
    }

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun purchaseToPurchaseDict(purchase: NamiPurchase): WritableMap {
    val purchaseMap = WritableNativeMap()

//    purchaseMap.putString("localizedDescription", purchase.localizedDescription ?: "")

    val purchaseSource = purchase.source ?: ""
//            nami_triggered or user_initiated
    var adjustedSource = "unknown"
    if (purchaseSource == "nami_triggered") {
        adjustedSource = "nami_rules"
    } else if (purchaseSource == "user_initiated") {
        adjustedSource = "user"
    }
    purchaseMap.putString("purchaseSource", adjustedSource)

    purchaseMap.putString("transactionIdentifier", purchase.transactionIdentifier ?: "")
    purchaseMap.putString("skuIdentifier", purchase.skuId ?: "")
//    val initiatedTimestamp = purchase.purchaseInitiatedTimestamp
//    val dt = Instant.ofEpochSecond(initiatedTimestamp)
//            .atZone(ZoneId.systemDefault())
//            .toLocalDateTime()
//    purchaseMap.putString("purchaseInitiatedTimestamp", purchase.purchaseInitiatedTimestamp ?: "")
    purchaseMap.putString("purchaseSource", purchase.purchaseSource ?: "")
    val expiresDate = purchase.expires
    if (expiresDate != null) {
        val expiresString = javascriptDateFromKJavaDate(expiresDate)
        purchaseMap.putString("subscriptionExpirationDate", expiresString)
    }


    // TODO: map kotlin dictionary into arbitrary map?
    purchaseMap.putMap("platformMetadata", WritableNativeMap())

    var purchasedSkuMap: WritableMap = WritableNativeMap()
    val purchasedSKU = purchase.purchasedSKU
    purchasedSKU?.let {
        purchasedSkuMap = skuToSkuDict(purchasedSKU)
    }
//    purchaseMap.putMap("purchasedSku", purchasedSkuMap)

    return purchaseMap
}

fun entitlementDictFromEntitlement(entitlement: NamiEntitlement): WritableMap? {
    var resultMap: WritableMap = WritableNativeMap()
    val referenceID: String = entitlement.referenceId ?: ""
    resultMap.putString("referenceID", referenceID)

    Log.i("NamiBridge", "Processing entitlement into Javascript Map with referenceID $referenceID")

    if (referenceID.isEmpty()) {
        // Without a reference ID, do not use this object
        return null
    }

    val namiID: String = entitlement.namiId ?: ""
    resultMap.putString("namiID", namiID)

    val description: String = entitlement.desc ?: ""
    resultMap.putString("desc", description)

    val name: String = entitlement.name ?: ""
    resultMap.putString("name", name)

    val activePurchasesArray: WritableArray = WritableNativeArray()
    val purchases = entitlement.activePurchases
    purchases.let {
        for (purchase in purchases) {
            val purchaseMap = purchaseToPurchaseDict(purchase)
            activePurchasesArray.pushMap(purchaseMap)
        }
    }
    resultMap.putArray("activePurchases", activePurchasesArray)


    val purchasedSKUsArray: WritableArray = WritableNativeArray()
    val purchasedSKUs = entitlement.purchasedSKUs
    for (sku in purchasedSKUs) {
        val skuMap = skuToSkuDict(sku)
        purchasedSKUsArray.pushMap(skuMap)
    }
    resultMap.putArray("purchasedSKUs", purchasedSKUsArray)


    val relatedSKUsArray: WritableArray = WritableNativeArray()
    val relatedSKUs = entitlement.relatedSKUs
    for (sku in relatedSKUs) {
        val skuMap = skuToSkuDict(sku)
        relatedSKUsArray.pushMap(skuMap)
    }
    resultMap.putArray("relatedSKUs", relatedSKUsArray)

    // For react, provide the most recent active purchase and sku from the arrays

    var lastPurchase: NamiPurchase? = null
    if (entitlement.activePurchases.count() > 0) {
        for (purchase in entitlement.activePurchases) {
            if (lastPurchase == null || lastPurchase.purchaseInitiatedTimestamp < purchase.purchaseInitiatedTimestamp) {
                lastPurchase = purchase
            }
        }
//            lastPurchase?.let { resultMap.putMap("latestPurchase", purchaseToPurchaseDict(lastPurchase)) }
    }

    var lastPurchasedSKU: NamiSKU? = lastPurchase?.purchasedSKU

    if (lastPurchasedSKU == null) {
        val lastPurcahsedSkuID = lastPurchase?.skuId
        if (lastPurcahsedSkuID != null ) {
            for (sku in entitlement.purchasedSKUs) {
                if (sku.skuId == lastPurcahsedSkuID) {
                    lastPurchasedSKU = sku
                }
            }
        }
    }
    if (lastPurchasedSKU == null && entitlement.purchasedSKUs.count() > 0) {
        lastPurchasedSKU = entitlement.purchasedSKUs.last()
    }
//        lastPurchasedSKU?.let { resultMap.putMap("lastPurchasedSKU", skuToSkuDict(lastPurchasedSKU)) }


    return resultMap
}


// Convert Java Date to ISO860 UTC date to pass to Javascript
fun javascriptDateFromKJavaDate(date: Date): String {
    val tz = TimeZone.getTimeZone("UTC")
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'")
    df.setTimeZone(tz)
    return df.format(date)
}

