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

    productDict.putString("skuId", this.skuId)
    productDict.putString("id", this.id)
    productDict.putString("type", this.type.toString())

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun NamiPurchase.toPurchaseDict(): WritableMap {
    val purchaseMap = WritableNativeMap()

    val purchaseSource = purchaseSource.toString()
    purchaseMap.putString("purchaseSource", purchaseSource)

    val skuDict = namiSku?.toSkuDict()
    purchaseMap.putMap("sku", skuDict)

    purchaseMap.putString("transactionIdentifier", transactionIdentifier.orEmpty())
    purchaseMap.putString("skuId", skuId)

    expires?.let {
        purchaseMap.putString("expires", it.toJavascriptDate())
    }
    val initiatedTimestamp = purchaseInitiatedTimestamp
    val purchaseInitiatedDate = Date(initiatedTimestamp)
    purchaseInitiatedDate.let {
        purchaseMap.putString("purchaseInitiatedTimestamp", it.toJavascriptDate())
    }

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
    resultMap.putString("referenceId", referenceId)

    Log.i(LOG_TAG, "Processing entitlement into Javascript Map with referenceID $referenceId")

    if (referenceId.isEmpty()) {
        // Without a reference ID, do not use this object
        return null
    }

    resultMap.putString("namiId", namiId.orEmpty())
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
    resultMap.putArray("purchasedSkus", purchasedSKUsArray)

    val relatedSKUsArray: WritableArray = WritableNativeArray()
    for (sku in relatedSKUs) {
        relatedSKUsArray.pushMap(sku.toSkuDict())
    }
    resultMap.putArray("relatedSkus", relatedSKUsArray)

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
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ", Locale.getDefault()).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }
    return df.format(this)
}
