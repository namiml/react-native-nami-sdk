package com.nami.reactlibrary

import android.util.Log
import com.android.billingclient.api.ProductDetails
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
    val productDict = Arguments.createMap()
    fillProductInfo(productDict, this)
    this.productDetails?.let { fillProductDetails(productDict, it) }
    return productDict
}

private fun fillProductInfo(productDict: WritableMap, sku: NamiSKU) {
    productDict.putString("skuId", sku.skuId)
    productDict.putString("id", sku.id)
    productDict.putString("type", sku.type.toString())
    productDict.putString("promoId", sku.promoId)
}

private fun fillProductDetails(productDict: WritableMap, details: ProductDetails) {
    val productDetailsMap = Arguments.createMap()
    productDetailsMap.putString("description", details.getDescription())
    productDetailsMap.putString("name", details.getName())
    productDetailsMap.putString("productId", details.getProductId())
    productDetailsMap.putString("type", details.getProductType())
    productDetailsMap.putString("title", details.getTitle())
    productDetailsMap.putString("detailsInString", details.toString())

    details.getOneTimePurchaseOfferDetails()?.let { fillOneTimePurchase(productDetailsMap, it) }
    details.getSubscriptionOfferDetails()?.let { fillSubscriptionOfferDetails(productDetailsMap, it) }

    productDict.putMap("googleProduct", productDetailsMap)
}

private fun fillOneTimePurchase(productDetailsMap: WritableMap, oneTimePurchaseDetails: ProductDetails.OneTimePurchaseOfferDetails) {
    val oneTimePurchaseMap = Arguments.createMap()
    oneTimePurchaseMap.putDouble("priceAmountMicros", oneTimePurchaseDetails.getPriceAmountMicros().toDouble())
    oneTimePurchaseMap.putString("formattedPrice", oneTimePurchaseDetails.getFormattedPrice())
    oneTimePurchaseMap.putString("priceCurrencyCode", oneTimePurchaseDetails.getPriceCurrencyCode())
    productDetailsMap.putMap("oneTimePurchaseOfferDetails", oneTimePurchaseMap)
}

private fun fillSubscriptionOfferDetails(productDetailsMap: WritableMap, subscriptionOfferDetails: List<ProductDetails.SubscriptionOfferDetails>) {
    val subscriptionOfferArray = Arguments.createArray()
    subscriptionOfferDetails.forEach { offer ->
        val offerMap = Arguments.createMap()
        fillPricingPhases(offerMap, offer.getPricingPhases().getPricingPhaseList())
        offerMap.putString("basePlanId", offer.getBasePlanId())
        offerMap.putString("offerId", offer.getOfferId())
        offerMap.putString("offerIdToken", offer.getOfferToken())
        fillOfferTags(offerMap, offer.getOfferTags())
        subscriptionOfferArray.pushMap(offerMap)
    }
    productDetailsMap.putArray("subscriptionOfferDetails", subscriptionOfferArray)
}

private fun fillPricingPhases(offerMap: WritableMap, pricingPhases: List<ProductDetails.PricingPhase>) {
    pricingPhases.forEach { pricingPhase ->
        val pricingPhasesMap = Arguments.createMap()
        pricingPhasesMap.putInt("billingCycleCount", pricingPhase.getBillingCycleCount())
        pricingPhasesMap.putInt("recurrenceMode", pricingPhase.getRecurrenceMode())
        pricingPhasesMap.putDouble("priceAmountMicros", pricingPhase.getPriceAmountMicros().toDouble())
        pricingPhasesMap.putString("billingPeriod", pricingPhase.getBillingPeriod())
        pricingPhasesMap.putString("formattedPrice", pricingPhase.getFormattedPrice())
        pricingPhasesMap.putString("priceCurrencyCode", pricingPhase.getPriceCurrencyCode())
        offerMap.putMap("pricingPhases", pricingPhasesMap)
    }
}

private fun fillOfferTags(offerMap: WritableMap, offerTags: List<String>) {
    val offerTagsArray = Arguments.createArray()
    offerTags.forEach { tag -> offerTagsArray.pushString(tag) }
    offerMap.putArray("offerTags", offerTagsArray)
}


// Really needs to be a NamiPurchase, when exists...
fun NamiPurchase.toPurchaseDict(): WritableMap {
    val purchaseMap = WritableNativeMap()

    val purchaseSource = purchaseSource.toString()
    purchaseMap.putString("purchaseSource", purchaseSource)

    Log.i(LOG_TAG, "toPurchaseDict NAMISKU1 $namiSku")
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
    Log.i(LOG_TAG, "toEntitlementDict purchasedSkusArray $purchasedSKUs")
    for (sku in purchasedSKUs) {
        purchasedSKUsArray.pushMap(sku.toSkuDict())
    }
    Log.i(LOG_TAG, "toEntitlementDict purchasedSkus $purchasedSKUsArray")
    resultMap.putArray("purchasedSkus", purchasedSKUsArray)

    val relatedSKUsArray: WritableArray = WritableNativeArray()
    Log.i(LOG_TAG, "toEntitlementDict relatedSKUsArray $relatedSKUs")
    for (sku in relatedSKUs) {
        relatedSKUsArray.pushMap(sku.toSkuDict())
    }
    Log.i(LOG_TAG, "toEntitlementDict relatedSkus $relatedSKUsArray")
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
