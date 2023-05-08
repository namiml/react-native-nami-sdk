package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.namiml.billing.NamiPurchase
import com.namiml.customer.CustomerJourneyState
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.LegalCitations
import com.namiml.paywall.NamiLocaleConfig
import com.namiml.paywall.NamiPaywall
import com.namiml.paywall.NamiPurchaseSource
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.SubscriptionPeriod
import com.namiml.util.extensions.getFormattedPrice
import com.namiml.util.extensions.getSubscriptionPeriodEnum
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone


fun List<*>.toWritableArray(): WritableArray {
    val convertedArray = Arguments.createArray()
    for (value in this) {
        when (value) {
            is String -> {
                convertedArray.pushString(value)
            }
            is Int -> {
                convertedArray.pushInt(value)
            }
            is Boolean -> {
                convertedArray.pushBoolean(value)
            }
            is Double -> {
                convertedArray.pushDouble(value)
            }
            is List<*> -> {
                convertedArray.pushArray(value.toWritableArray())
            }
            is Map<*, *> -> {
                convertedArray.pushMap(value.toWritableMap())
            }
        }
    }
    return convertedArray
}

// React has a method makeNativeMap that doesn't work, as per react standards.  Build our own primitive mapper to make up for react shortcomings.
fun Map<*, *>.toWritableMap(): WritableMap {
    val convertedMap = Arguments.createMap()
    for ((key, value) in this) {
        if (key is String) {
            when (value) {
                is String -> {
                    convertedMap.putString(key, value)
                }
                is Int -> {
                    convertedMap.putInt(key, value)
                }
                is Boolean -> {
                    convertedMap.putBoolean(key, value)
                }
                is Double -> {
                    convertedMap.putDouble(key, value)
                }
                is List<*> -> {
                    convertedMap.putArray(key, value.toWritableArray())
                }
                is Map<*, *> -> {
                    convertedMap.putMap(key, value.toWritableMap())
                }
            }
        }
    }
    return convertedMap
}

fun NamiSKU.toSkuDict(): WritableMap {
    val productDict = Arguments.createMap()

    productDict.putString("skuIdentifier", skuId)
//    productDict.putString("localizedTitle", skuDetails.title)
//    productDict.putString("localizedDescription", skuDetails.description)
//    productDict.putString("localizedPrice", skuDetails.price)
//    productDict.putString("localizedMultipliedPrice", skuDetails.price)
    productDict.putBoolean("featured", featured)
//    productDict.putString("displayText", displayText)
//    productDict.putString("displaySubText", displaySubText)
//    productDict.putString("price", skuDetails.getFormattedPrice().toString())
    productDict.putString("priceLanguage", Locale.getDefault().language)
    productDict.putString("priceCountry", Locale.getDefault().country)
//    productDict.putString("priceCurrency", skuDetails.priceCurrencyCode)
    productDict.putString("numberOfUnits", "1")
//    val subscriptionPeriod = when (skuDetails.getSubscriptionPeriodEnum()) {
//        SubscriptionPeriod.MONTHLY -> {
//            "month"
//        }
//        SubscriptionPeriod.HALF_YEAR -> {
//            "half_year"
//        }
//        SubscriptionPeriod.WEEKLY -> {
//            "week"
//        }
//        SubscriptionPeriod.QUARTERLY -> {
//            "quarter"
//        }
//        SubscriptionPeriod.ANNUAL -> {
//            "year"
//        }
//        SubscriptionPeriod.FOUR_WEEKS -> {
//            "four_weeks"
//        }
//        else -> {
//            null
//        }
//    }
//    if (subscriptionPeriod != null) {
//        productDict.putString("periodUnit", subscriptionPeriod)
//    }

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun NamiPurchase.toPurchaseDict(): WritableMap {
    val purchaseMap = WritableNativeMap()

//    val purchaseSource = when (purchaseSource) {
//        NamiPurchaseSource.NAMI_PAYWALL -> {
//            "nami_rules"
//        }
//        NamiPurchaseSource.APPLICATION -> {
//            "user"
//        }
//        else -> {
//            "unknown"
//        }
//    }
//    purchaseMap.putString("purchaseSource", purchaseSource)

    purchaseMap.putString("transactionIdentifier", transactionIdentifier.orEmpty())
    purchaseMap.putString("skuIdentifier", skuId)

    expires?.let {
        purchaseMap.putString("subscriptionExpirationDate", it.toJavascriptDate())
    }

    // Removed, not sure why, should add back in when possible
    //    val initiatedTimestamp = purchase.purchaseInitiatedTimestamp
    //    val dt = Instant.ofEpochSecond(initiatedTimestamp)
    //            .atZone(ZoneId.systemDefault())
    //            .toLocalDateTime()
    //    purchaseMap.putString("purchaseInitiatedTimestamp", purchase.purchaseInitiatedTimestamp ?: "")

    // TODO: map kotlin dictionary into arbitrary map?
    purchaseMap.putMap("platformMetadata", WritableNativeMap())

    return purchaseMap
}

fun CustomerJourneyState?.toDict(): WritableMap {
    val formerSubscriber = this?.formerSubscriber ?: false
    val inGracePeriod = this?.inGracePeriod ?: false
    val inTrialPeriod = this?.inTrialPeriod ?: false
    val inIntroOfferPeriod = this?.inIntroOfferPeriod ?: false
    val inPause = this?.inPause ?: false
    val inAccountHold = this?.inAccountHold ?: false
    val isCancelled = this?.isCancelled ?: false

    return WritableNativeMap().apply {
        putBoolean("formerSubscriber", formerSubscriber)
        putBoolean("inGracePeriod", inGracePeriod)
        putBoolean("inTrialPeriod", inTrialPeriod)
        putBoolean("inIntroOfferPeriod", inIntroOfferPeriod)
        putBoolean("inPause", inPause)
        putBoolean("inAccountHold", inAccountHold)
        putBoolean("isCancelled", isCancelled)
    }
}

fun NamiEntitlement.toEntitlementDict(): WritableMap? {
    val resultMap: WritableMap = WritableNativeMap()
    resultMap.putString("referenceID", referenceId)

    Log.i(LOG_TAG, "Processing entitlement into Javascript Map with referenceID $referenceId")

    if (referenceId.isEmpty()) {
        // Without a reference ID, do not use this object
        return null
    }

    resultMap.putString("namiID", namiId.orEmpty())
    resultMap.putString("desc", desc.orEmpty())
    resultMap.putString("name", name.orEmpty())

    val activePurchasesArray: WritableArray = WritableNativeArray()
    for (purchase in activePurchases) {
        activePurchasesArray.pushMap(purchase.toPurchaseDict())
    }
    resultMap.putArray("activePurchases", activePurchasesArray)

    val purchasedSKUsArray: WritableArray = WritableNativeArray()
    for (sku in purchasedSKUs) {
        purchasedSKUsArray.pushMap(sku.toSkuDict())
    }
    resultMap.putArray("purchasedSKUs", purchasedSKUsArray)

    val relatedSKUsArray: WritableArray = WritableNativeArray()
    for (sku in relatedSKUs) {
        relatedSKUsArray.pushMap(sku.toSkuDict())
    }
    resultMap.putArray("relatedSKUs", relatedSKUsArray)

    // For react, provide the most recent active purchase and sku from the arrays

    var lastPurchase: NamiPurchase? = null
    if (activePurchases.count() > 0) {
        for (purchase in activePurchases) {
            if (lastPurchase == null || lastPurchase.purchaseInitiatedTimestamp < purchase.purchaseInitiatedTimestamp) {
                lastPurchase = purchase
            }
        }
    }

    return resultMap
}

// Convert Java Date to ISO860 UTC date to pass to Javascript
fun Date.toJavascriptDate(): String {
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }
    return df.format(this)
}
