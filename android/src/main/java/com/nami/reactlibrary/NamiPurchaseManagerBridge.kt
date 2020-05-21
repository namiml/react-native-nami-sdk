package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    override fun initialize() {
        // TODO: Register for purchase callbacks
    }

    @ReactMethod
    fun clearBypassStorePurchases() {
        Log.e("NamiBridge", "Bypass store not yet implemented for Android.")
        NamiPurchaseManager.clearBypassStorePurchases()
    }


    @ReactMethod
    fun buySKU(skuPlatformID: String, developerPaywallID: String, resultsCallback: Callback) {
        currentActivity?.let {
            NamiPurchaseManager.buySKU(it, skuPlatformID) {

                // Currently not sure how to check if purchase worked?  Just return false.
                val resultArray: WritableArray = WritableNativeArray()
                resultArray.pushBoolean(false)
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
    fun isSKUPurchased(skuID: String, resultsCallback: Callback) {
        val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)

        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushBoolean(isPurchased)
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun anySKUPurchased(skuIDs: ReadableArray, resultsCallback: Callback) {
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

}