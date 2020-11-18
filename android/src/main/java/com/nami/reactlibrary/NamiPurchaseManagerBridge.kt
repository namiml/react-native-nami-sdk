package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    @ReactMethod
    fun clearBypassStorePurchases() {
        NamiPurchaseManager.clearBypassStorePurchases()
    }

    @ReactMethod
    fun buySKU(skuPlatformID: String, developerPaywallID: String, resultsCallback: Callback) {
        currentActivity?.let {
            NamiPurchaseManager.buySKU(it, skuPlatformID) {

                val resultArray: WritableArray = WritableNativeArray()
                if (NamiPurchaseManager.isSKUIDPurchased(skuPlatformID)) {
                    resultArray.pushBoolean(true)
                    Log.i(LOG_TAG, "Purchase complete, result is PURCHASED.")
                } else {
                    Log.i(LOG_TAG, "Purchase complete, product not purchased.")
                    resultArray.pushBoolean(false)
                }
                resultsCallback.invoke(resultArray)
            }
        }
    }

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
        val purchases = NamiPurchaseManager.allPurchases()

        // Pass back empty array until we can get purchases from the SDK
        val resultArray: WritableArray = WritableNativeArray()

        for (purchase in purchases) {
            val purchaseDict = purchaseToPurchaseDict(purchase)
            resultArray.pushMap(purchaseDict)
        }

        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun isSKUIDPurchased(skuID: String, resultsCallback: Callback) {
        val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)

        resultsCallback.invoke(isPurchased)
    }

    @ReactMethod
    fun anySKUIDPurchased(skuIDs: ReadableArray, resultsCallback: Callback) {
        val checkArray: MutableList<String> = mutableListOf()
        for (x in 0 until skuIDs.size()) {
            if (skuIDs.getType(x) == ReadableType.String) {
                val skuID = skuIDs.getString(x)
                if (skuID != null && skuID.isNotEmpty()) {
                    checkArray.add(skuID)
                }
            }
        }

        val anyPurchased = NamiPurchaseManager.anySKUIDPurchased(checkArray)

        resultsCallback.invoke(anyPurchased)
    }

    @ReactMethod
    fun restorePurchases(resultsCallback: Callback) {
        Log.e(LOG_TAG, "Restore Purchases called on Android platform, has no effect on Android.")

        val resultMap = WritableNativeMap().apply {
            putBoolean("success", true)
        }
        val resultArray: WritableArray = WritableNativeArray().apply {
            pushMap(resultMap)
        }
        resultsCallback.invoke(resultArray)
    }

}