package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.billing.NamiPurchaseState

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    override fun initialize() {
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
                    Log.i("NamiBridge", "Purchase complete, result is PURCHASED.")
                } else {
                    Log.i("NamiBridge", "Purchase complete, product not purchased.")
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
        var resultArray: WritableArray = WritableNativeArray()

        for (purchase in purchases) {
            val purchaseDict = purchaseToPurchaseDict(purchase)
            resultArray.pushMap(purchaseDict)
        }

        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun isSKUIDPurchased(skuID: String, resultsCallback: Callback) {
        val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)

        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushBoolean(isPurchased)
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun anySKUIDPurchased(skuIDs: ReadableArray, resultsCallback: Callback) {
        var isPurchased = false
        //TODO : expose Android Active Purchases
        for (purchase in NamiPurchaseManager.allPurchases()) {
            purchase.skuId?.let {
                if (NamiPurchaseManager.isSKUIDPurchased(it)) {
                    isPurchased = true
                }
            }
        }

        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushBoolean(isPurchased)
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun restorePurchases(resultsCallback: Callback) {
        Log.e("NamiBridge", "Restore Purchases called on Android platform, has no effect on Android.")

        val resultMap: WritableNativeMap = WritableNativeMap()
        resultMap.putBoolean("success", true)
        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushMap(resultMap)
        resultsCallback.invoke(resultArray)
    }

}