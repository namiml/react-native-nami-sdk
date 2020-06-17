package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.Nami
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.entitlement.NamiEntitlement
import com.namiml.entitlement.NamiEntitlementManager
import com.namiml.entitlement.NamiEntitlementSetter
import com.namiml.entitlement.NamiPlatformType
import com.namiml.paywall.NamiSKU
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

        Log.i("NamiBridge", "Checking for $entitlementRefID entitlement active, result was $isActive")
        resultsCallback.invoke(resultMap)
    }

    @ReactMethod
    fun activeEntitlements(resultsCallback: Callback) {

        val nativeEntitlements = NamiEntitlementManager.activeEntitlements()

        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in nativeEntitlements) {
            val entitlementDict = entitlementDictFromEntitlemment(entitlement)
            entitlementDict?.let { resultArray.pushMap(entitlementDict) }
        }
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun getEntitlements(resultsCallback: Callback) {

        val nativeEntitlements = NamiEntitlementManager.getEntitlements()

        Log.i("NamiBridge", "getEntitlements result is $nativeEntitlements")

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

    @ReactMethod
    fun clearAllEntitlements() {
        NamiEntitlementManager.clearAllEntitlements()
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

                //referenceId: kotlin.String, purchasedSKUid: kotlin.String?, expires: java.util.Date?, platform: com.namiml.entitlement.NamiPlatformType
                val setter = NamiEntitlementSetter(referenceID, platform, purchasedSKUid, expires)
                return setter
            }
        }
        Log.e("NamiBridge", "Attempted to set entitlement with no referenceID " + entitlementSetterMap);

        return null
    }

    fun entitlementDictFromEntitlemment(entitlement: NamiEntitlement): WritableMap? {
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
                    if (sku.product == lastPurcahsedSkuID) {
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

}