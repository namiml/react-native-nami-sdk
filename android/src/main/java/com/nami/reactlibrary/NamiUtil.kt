package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.api.model.FormattedSku
import com.namiml.billing.NamiPurchase
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiPaywall
import com.namiml.paywall.NamiPurchaseSource
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.PaywallStyleData
import com.namiml.util.extensions.getFormattedPrice
import com.namiml.util.extensions.getSubscriptionPeriodEnum
import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*

fun FormattedSku.toFormattedSkuDict(): WritableMap {
    val map: WritableMap = Arguments.createMap()
    map.putString("id", this.id)
    map.putBoolean("featured", this.featured)
    return map
}

fun NamiPaywall.toNamiPaywallDict(): WritableMap {

    val paywallMap: WritableMap = Arguments.createMap()
    paywallMap.putString("title", title.orEmpty())
    paywallMap.putString("body", body.orEmpty())

    val marketingContentMap = Arguments.createMap()
    marketingContentMap.putString("title", title.orEmpty())
    marketingContentMap.putString("body", body.orEmpty())

    val extraDataMap = extraData
    if (extraDataMap != null) {
        marketingContentMap.putMap("extra_data", extraDataMap.toWritableMap())
    }

    paywallMap.putMap("marketing_content", marketingContentMap)

    Log.i(LOG_TAG, "extraData items are $extraDataMap")
    paywallMap.putString("id", id)
    paywallMap.putString("background_image_url_phone", backgroundImageUrlPhone.orEmpty())
    paywallMap.putString("background_image_url_tablet", backgroundImageUrlTablet.orEmpty())
    paywallMap.putString("privacy_policy", privacyPolicy.orEmpty())
    paywallMap.putString("purchase_terms", purchaseTerms.orEmpty())
    paywallMap.putString("tos_link", tosLink.orEmpty())
    paywallMap.putString("name", name.orEmpty())
    paywallMap.putString("cta_type", type)
    paywallMap.putString("developer_paywall_id", developerPaywallId.orEmpty())

    val allowClosing = allowClosing
    paywallMap.putBoolean("allow_closing", allowClosing)

    val restoreControl = restoreControl
    paywallMap.putBoolean("restore_control", restoreControl)

    val signInControl = signInControl
    paywallMap.putBoolean("sign_in_control", signInControl)

    val formattedSkusArray: WritableArray = Arguments.createArray()
    for (formattedSku in formattedSkus) {
        formattedSkusArray.pushMap(formattedSku.toFormattedSkuDict())
    }
    paywallMap.putArray("formatted_skus", formattedSkusArray)
    // TODO uncomment and fix once Android has "use_bottom_overlay" available
    //paywallMap.putArray("use_bottom_overlay", formattedSkusArray)

    return paywallMap
}

fun PaywallStyleData.toPaywallStylingDict(): WritableMap {

    val styleMap: WritableMap = Arguments.createMap()
    styleMap.putString("backgroundColor", backgroundColor)

    styleMap.putDouble("bodyFontSize", bodyFontSize.toDouble())
    styleMap.putString("bodyTextColor", bodyTextColor)
    styleMap.putString("bodyShadowColor", bodyShadowColor)
    styleMap.putDouble("bodyShadowRadius", bodyShadowRadius.toDouble())

    styleMap.putDouble("titleFontSize", titleFontSize.toDouble())
    styleMap.putString("titleTextColor", titleTextColor)
    styleMap.putString("titleShadowColor", titleShadowColor)
    styleMap.putDouble("titleShadowRadius", titleShadowRadius.toDouble())

    styleMap.putDouble("closeButtonFontSize", closeButtonFontSize.toDouble())
    styleMap.putString("closeButtonTextColor", closeButtonTextColor)
    styleMap.putString("closeButtonShadowColor", closeButtonShadowColor)
    styleMap.putDouble("closeButtonShadowRadius", closeButtonShadowRadius.toDouble())

    styleMap.putString("bottomOverlayColor", bottomOverlayColor)
    styleMap.putDouble("bottomOverlayCornerRadius", bottomOverlayCornerRadius.toDouble())

    styleMap.putString("skuButtonColor", skuButtonColor)
    styleMap.putString("skuButtonTextColor", skuButtonTextColor)

    styleMap.putString("featuredSkusButtonColor", featuredSkuButtonColor)
    styleMap.putString("featuredSkusButtonTextColor", featuredSkuButtonTextColor)

    styleMap.putDouble("signinButtonFontSize", signInButtonFontSize.toDouble())
    styleMap.putString("signinButtonTextColor", signInButtonTextColor)
    styleMap.putString("signinButtonShadowColor", signInButtonShadowColor)
    styleMap.putDouble("signinButtonShadowRadius", signInButtonShadowRadius.toDouble())

    styleMap.putDouble("restoreButtonFontSize", restoreButtonFontSize.toDouble())
    styleMap.putString("restoreButtonTextColor", restoreButtonTextColor)
    styleMap.putString("restoreButtonShadowColor", restoreButtonShadowColor)
    styleMap.putDouble("restoreButtonShadowRadius", restoreButtonShadowRadius.toDouble())

    styleMap.putDouble("purchaseTermsFontSize", purchaseTermsFontSize.toDouble())
    styleMap.putString("purchaseTermsTextColor", purchaseTermsTextColor)
    styleMap.putString("purchaseTermsShadowColor", purchaseTermsShadowColor)
    styleMap.putDouble("purchaseTermsShadowRadius", purchaseTermsShadowRadius.toDouble())

    styleMap.putString("termsLinkColor", termsLinkColor)

    return styleMap
}

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
    productDict.putString("localizedTitle", skuDetails.title)
    productDict.putString("localizedDescription", skuDetails.description)
    productDict.putString("localizedPrice", skuDetails.price)
    productDict.putString("localizedMultipliedPrice", skuDetails.price)
    productDict.putString("price", skuDetails.getFormattedPrice().toString())
    productDict.putString("priceLanguage", Locale.getDefault().language)
    productDict.putString("priceCountry", Locale.getDefault().country)
    productDict.putString("priceCurrency", skuDetails.priceCurrencyCode)
    productDict.putString("numberOfUnits", "1")
    val subscriptionPeriod = skuDetails.getSubscriptionPeriodEnum()
    if (subscriptionPeriod != null) {
        productDict.putString("periodUnit", subscriptionPeriod.durationInDays.toString())
    }

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun NamiPurchase.toPurchaseDict(): WritableMap {
    val purchaseMap = WritableNativeMap()

    val purchaseSource = when (purchaseSource) {
        NamiPurchaseSource.NAMI_PAYWALL -> {
            "nami_rules"
        }
        NamiPurchaseSource.APPLICATION -> {
            "user"
        }
        else -> {
            "unknown"
        }
    }
    purchaseMap.putString("purchaseSource", purchaseSource)

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
        setTimeZone(TimeZone.getTimeZone("UTC"))
    }
    return df.format(this)
}

