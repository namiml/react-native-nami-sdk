package com.namiml.reactnative

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.namiml.billing.NamiPurchase
import com.namiml.customer.CustomerJourneyState
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiSKU
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
    val productDict = WritableNativeMap()

    productDict.putString("id", this.id)
    productDict.putString("skuId", this.skuId)
    productDict.putString("name", this.name ?: "")
    productDict.putString("type", this.type?.toString().lowercase() ?: "unknown")

    this.promoId?.let {
        productDict.putString("promoId", it)
    }

    this.promoOfferToken?.let {
        productDict.putString("promoToken", it)
    }

    return productDict
}

fun NamiPurchase.toPurchaseDict(): WritableMap {
    val purchaseMap = WritableNativeMap()

    purchaseMap.putString("skuId", skuId)
    purchaseMap.putString("transactionIdentifier", transactionIdentifier.orEmpty())

    purchaseSource?.let {
        purchaseMap.putString("purchaseSource", it.toString())
    }

    namiSku?.let { sku ->
        val skuMap = WritableNativeMap()
        skuMap.putString("id", sku.id)
        skuMap.putString("skuId", sku.skuId)
        skuMap.putString("name", sku.name ?: "")
        skuMap.putString("type", sku.type?.toString() ?: "unknown") // match NamiSKUType
        skuMap.putString("promoId", sku.promoId)
        skuMap.putString("promoToken", sku.promoOfferToken)
        purchaseMap.putMap("sku", skuMap)
    }

    expires?.let {
        purchaseMap.putDouble("expires", it.time.toDouble())
    }

    purchaseMap.putDouble("purchaseInitiatedTimestamp", purchaseInitiatedTimestamp.toDouble())

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
