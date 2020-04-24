package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager
import com.namiml.entitlement.NamiEntitlement
import com.namiml.entitlement.NamiEntitlementManager
import com.namiml.entitlement.NamiEntitlementSetter
import com.namiml.entitlement.NamiPlatformType
import java.util.*

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

        val nativeEntitlements = NamiEntitlementManager.activeEntitlements()

        val firstEntitlement = nativeEntitlements.first()

        val referenceID = firstEntitlement.namiId //???
        val name = firstEntitlement.name
        val desc = firstEntitlement.desc
        val relatedSkus = firstEntitlement.relatedSKUs
        val activePurcahses = firstEntitlement.activePurchases
        val isActive = firstEntitlement.isActive()

        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in nativeEntitlements) {
            val entitlementDict = entitlementDictFromEntitlemment(entitlement)
            entitlementDict?.let { resultArray.pushMap(entitlementDict) }
        }
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun getEntitlements(resultsCallback: Callback) {

        // TODO: add get entitlements to Android

        val nativeEntitlements = NamiEntitlementManager.getEntitlements()

        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in nativeEntitlements) {
            val entitlementDict = entitlementDictFromEntitlemment(entitlement)
            entitlementDict?.let { resultArray.pushMap(entitlementDict) }
        }
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun setEntitlements(entitlements: ReadableArray) {
        val entitlementsToSet = ArrayList<NamiEntitlementSetter>()

        val size = entitlements.size()
        var index = 0
        while (index < size) {
            val setterMap: ReadableMap? = entitlements.getMap(index)
            setterMap?.let {
                val entitlementSetter = entitlementSetterFromSetterMap(setterMap)
                entitlementSetter?.let {
                    entitlementsToSet.add(entitlementSetter)
                }
            }
            index = index + 1
        }

        NamiEntitlementManager.setEntitlements(entitlementsToSet)
    }

    fun entitlementSetterFromSetterMap(entitlementSetterMap: ReadableMap): NamiEntitlementSetter? {
        if (entitlementSetterMap.hasKey("referenceID")) {
            val referenceID = entitlementSetterMap.getString("referenceID") ?: ""
            if (referenceID.isNotEmpty()) {
                var expires: Date? = null

                var purchasedSKUid: String? = null
                if (entitlementSetterMap.hasKey("purchasedSKUID")) {
                    purchasedSKUid = entitlementSetterMap.getString("purchasedSKUid")
                }

                var platform: NamiPlatformType = NamiPlatformType.UNKNOWN
                if (entitlementSetterMap.hasKey("platform")) {
                    platform = when (entitlementSetterMap.getString("platform")) {
                        "other" -> NamiPlatformType.OTHER

                        "android" -> NamiPlatformType.ANDROID

                        "apple" -> NamiPlatformType.APPLE

                        "roku" -> NamiPlatformType.ROKU

                        "web" -> NamiPlatformType.WEB

                        "unknown" -> NamiPlatformType.UNKNOWN

                        else -> NamiPlatformType.UNKNOWN
                    }
                }

                val setter = NamiEntitlementSetter(referenceID, purchasedSKUid, expires, platform)
                return setter
            }
        }
        Log.e("NamiBridge", "Attempted to set entitlement with no referenceID " + entitlementSetterMap);

        return null
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
        purchases.let {
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

        return resultMap
    }

}