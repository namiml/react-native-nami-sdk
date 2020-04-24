package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager
import com.namiml.entitlement.NamiEntitlement
import com.namiml.entitlement.NamiEntitlementManager
import com.namiml.entitlement.NamiEntitlementSetter
import com.namiml.entitlement.NamiPlatformType

class NamiEntitlementManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiEntitlementManagerBridge"
    }

    @ReactMethod
    fun isEntitlementActive(entitlementRefID: String, resultsCallback: Callback) {

        val isActive = NamiEntitlementManager.isEntitlementActive(entitlementRefID)
        var resultMap: WritableMap = WritableNativeMap()
        resultMap.putBoolean("active", isActive)
        resultsCallback.invoke(resultMap)
    }

    @ReactMethod
    fun activeEntitlements(resultsCallback: Callback) {

        val entitlements = NamiEntitlementManager.activeEntitlements()

        val firstEntitlement = entitlements.first()

        val referenceID = firstEntitlement.namiId //???
        val name = firstEntitlement.name
        val desc = firstEntitlement.desc
        val relatedSkus = firstEntitlement.relatedSKUs
        val activePurcahses = firstEntitlement.activePurchases
        val isActive = firstEntitlement.isActive()

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun getEntitlements(resultsCallback: Callback) {

        // TODO: add get entitlements to Android

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun setEntitlements(entitlements: ReadableMap) {

        var referenceID: String = ""
        if (entitlements.hasKey("referenceID")) {
            referenceID = entitlements.getString("referenceID") ?: ""
        }

        if (referenceID.length != 0) {
            var namiSetter = NamiEntitlementSetter(referenceID)
            namiSetter.expires = ///???  String should be date?
                    namiSetter.platform = android
            namiSetter.purchasedSKUid = ""
        }
    }

    fun entitlementDictFromEntitlemment(entitlement: NamiEntitlement): WritableMap? {
        var resultMap: WritableMap = WritableNativeMap()
        val referenceID: String = entitlement.referenceId ?: ""
        resultMap.putString("referenceId", referenceID)

        if (referenceID.isEmpty()) {
            // Without a reference ID, do not use this object
            return null
        }

        val namiID: String = entitlement.namiId ?: ""
        resultMap.putString("namiID", namiID)

        val description: String = entitlement.desc ?: ""
        resultMap.putString("description", description)

        val isActive: Boolean = entitlement.isActive() ?: false
        resultMap.putBoolean("isActive", isActive)

        val platformStr: String = when (entitlement.platform) {
            NamiPlatformType.OTHER -> "other"

            NamiPlatformType.ANDROID -> "android"

            NamiPlatformType.APPLE -> "apple"

            NamiPlatformType.ROKU -> "roku"

            NamiPlatformType.WEB -> "web"

            NamiPlatformType.UNKNOWN -> "unknown"
        }
        resultMap.putString("platformStr", platformStr)

        val activePurchasesArray: WritableArray = WritableNativeArray()
        val purchases = entitlement.activePurchases
        purchases?.let {
            for (purchase in purchases) {
                val purchaseMap = purchaseToPurchaseDict(purchase)
                activePurchasesArray.pushMap(purchaseMap)
            }
        }
        resultMap.putArray("activePurchasesArray", activePurchasesArray)


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

        val lastPurchaseSkKU = entitlement.purchasedSKUs.last()
        lastPurchaseSkKU.let { resultMap.putMap("purchasedSKU", skuToSkuDict(lastPurchaseSkKU)) }

        val lastPurchase = entitlement.activePurchases.last()
        lastPurchase.let { resultMap.putMap("activePurchase", purchaseToPurchaseDict(lastPurchase)) }

        val namiID: String = entitlement.?: ""
        resultMap.putString("namiID", namiID)

        return resultMap
    }

}