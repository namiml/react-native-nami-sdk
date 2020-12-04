package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
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

fun paywallToPaywallDict(paywallData: NamiPaywall): WritableMap {

    val paywallMap: WritableMap = Arguments.createMap()
    paywallMap.putString("title", paywallData.title.orEmpty())
    paywallMap.putString("body", paywallData.body.orEmpty())

    val marketingContentMap = Arguments.createMap()
    marketingContentMap.putString("title", paywallData.title.orEmpty())
    marketingContentMap.putString("body", paywallData.body.orEmpty())

    val extraDataMap = paywallData.extraData
    if (extraDataMap != null) {
        val convertedMap = convertNativeMapBecauseReact(extraDataMap)
        marketingContentMap.putMap("extra_data", convertedMap)
    }

    paywallMap.putMap("marketing_content", marketingContentMap)

    Log.i(LOG_TAG, "extraData items are $extraDataMap")
    paywallMap.putString("id", paywallData.id)
    paywallMap.putString("background_image_url_phone", paywallData.backgroundImageUrlPhone.orEmpty())
    paywallMap.putString("background_image_url_tablet", paywallData.backgroundImageUrlTablet.orEmpty())
    paywallMap.putString("privacy_policy", paywallData.privacyPolicy.orEmpty())
    paywallMap.putString("purchase_terms", paywallData.purchaseTerms.orEmpty())
    paywallMap.putString("tos_link", paywallData.tosLink.orEmpty())
    paywallMap.putString("name", paywallData.name.orEmpty())
    paywallMap.putString("cta_type", paywallData.type)
    paywallMap.putString("developer_paywall_id", paywallData.developerPaywallId.orEmpty())

    val allowClosing = paywallData.allowClosing
    paywallMap.putBoolean("allow_closing", allowClosing)

    val restoreControl = paywallData.restoreControl
    paywallMap.putBoolean("restore_control", restoreControl)

    val signInControl = paywallData.signInControl
    paywallMap.putBoolean("sign_in_control", signInControl)

    return paywallMap
}

fun paywallStylingToPaywallStylingDict(styling: PaywallStyleData): WritableMap {

    val styleMap: WritableMap = Arguments.createMap()
        styleMap.putString("backgroundColor", styling.backgroundColor)

        styleMap.putDouble("bodyFontSize", styling.bodyFontSize.toDouble())
        styleMap.putString("bodyTextColor", styling.bodyTextColor)
        styleMap.putString("bodyShadowColor", styling.bodyShadowColor)
        styleMap.putDouble("bodyShadowRadius", styling.bodyShadowRadius.toDouble())

        styleMap.putDouble("titleFontSize", styling.titleFontSize.toDouble())
        styleMap.putString("titleTextColor", styling.titleTextColor)
        styleMap.putString("titleShadowColor", styling.titleShadowColor)
        styleMap.putDouble("titleShadowRadius", styling.titleShadowRadius.toDouble())

        styleMap.putDouble("closeButtonFontSize", styling.closeButtonFontSize.toDouble())
        styleMap.putString("closeButtonTextColor", styling.closeButtonTextColor)
        styleMap.putString("closeButtonShadowColor", styling.closeButtonShadowColor)
        styleMap.putDouble("closeButtonShadowRadius", styling.closeButtonShadowRadius.toDouble())

        styleMap.putString("bottomOverlayColor", styling.bottomOverlayColor)
        styleMap.putDouble("bottomOverlayCornerRadius", styling.bottomOverlayCornerRadius.toDouble())

        styleMap.putString("skuButtonColor", styling.skuButtonColor)
        styleMap.putString("skuButtonTextColor", styling.skuButtonTextColor)

        styleMap.putString("featuredSkusButtonColor", styling.featuredSkuButtonColor)
        styleMap.putString("featuredSkusButtonTextColor", styling.featuredSkuButtonTextColor)

        styleMap.putDouble("signinButtonFontSize", styling.signInButtonFontSize.toDouble())
        styleMap.putString("signinButtonTextColor", styling.signInButtonTextColor)
        styleMap.putString("signinButtonShadowColor", styling.signInButtonShadowColor)
        styleMap.putDouble("signinButtonShadowRadius", styling.signInButtonShadowRadius.toDouble())

        styleMap.putDouble("restoreButtonFontSize", styling.restoreButtonFontSize.toDouble())
        styleMap.putString("restoreButtonTextColor", styling.restoreButtonTextColor)
        styleMap.putString("restoreButtonShadowColor", styling.restoreButtonShadowColor)
        styleMap.putDouble("restoreButtonShadowRadius", styling.restoreButtonShadowRadius.toDouble())

        styleMap.putDouble("purchaseTermsFontSize", styling.purchaseTermsFontSize.toDouble())
        styleMap.putString("purchaseTermsTextColor", styling.purchaseTermsTextColor)
        styleMap.putString("purchaseTermsShadowColor", styling.purchaseTermsShadowColor)
        styleMap.putDouble("purchaseTermsShadowRadius", styling.purchaseTermsShadowRadius.toDouble())

        styleMap.putString("termsLinkColor", styling.termsLinkColor)

    return styleMap
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


// React has a method makeNativeMap that doesn't work, as per react standards.  Build our own primitive mapper to make up for react shortcomings.
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
    productDict.putString("localizedTitle", namiSKU.skuDetails.title)
    productDict.putString("localizedDescription", namiSKU.skuDetails.description)
    productDict.putString("localizedPrice", namiSKU.skuDetails.price)
    productDict.putString("localizedMultipliedPrice", namiSKU.skuDetails.price)
    productDict.putString("price", namiSKU.skuDetails.getFormattedPrice().toString())
    productDict.putString("priceLanguage", Locale.getDefault().language)
    productDict.putString("priceCountry", Locale.getDefault().country)
    productDict.putString("priceCurrency", namiSKU.skuDetails.priceCurrencyCode)
    productDict.putString("numberOfUnits", "1")
    val subscriptionPeriod = namiSKU.skuDetails.getSubscriptionPeriodEnum()
    if (subscriptionPeriod != null) {
        productDict.putString("periodUnit", subscriptionPeriod.durationInDays.toString())
    }

    return productDict
}

// Really needs to be a NamiPurchase, when exists...
fun purchaseToPurchaseDict(purchase: NamiPurchase): WritableMap {
    val purchaseMap = WritableNativeMap()

    val purchaseSource = when (purchase.purchaseSource) {
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

    purchaseMap.putString("transactionIdentifier", purchase.transactionIdentifier.orEmpty())
    purchaseMap.putString("skuIdentifier", purchase.skuId.orEmpty())

    val expiresDate = purchase.expires
    if (expiresDate != null) {
        val expiresString = javascriptDateFromKJavaDate(expiresDate)
        purchaseMap.putString("subscriptionExpirationDate", expiresString)
    }


    // TODO: map kotlin dictionary into arbitrary map?
    purchaseMap.putMap("platformMetadata", WritableNativeMap())

    return purchaseMap
}

fun entitlementDictFromEntitlement(entitlement: NamiEntitlement): WritableMap? {
    val resultMap: WritableMap = WritableNativeMap()
    val referenceID: String = entitlement.referenceId
    resultMap.putString("referenceID", referenceID)

    Log.i(LOG_TAG, "Processing entitlement into Javascript Map with referenceID $referenceID")

    if (referenceID.isEmpty()) {
        // Without a reference ID, do not use this object
        return null
    }

    resultMap.putString("namiID", entitlement.namiId.orEmpty())
    resultMap.putString("desc", entitlement.desc.orEmpty())
    resultMap.putString("name", entitlement.name.orEmpty())

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
    }

    return resultMap
}


// Convert Java Date to ISO860 UTC date to pass to Javascript
fun javascriptDateFromKJavaDate(date: Date): String {
    val df: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'", Locale.getDefault()).apply {
        setTimeZone(TimeZone.getTimeZone("UTC"))
    }
    return df.format(date)
}

