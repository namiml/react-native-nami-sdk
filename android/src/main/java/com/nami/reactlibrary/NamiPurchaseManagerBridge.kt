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
        Log.e("ReactNative", "NAMI - bypass store not yet implemented for Android. ")
    }

    @ReactMethod
    fun bypassStore(bypass: Boolean) {
        Log.e("ReactNative", "NAMI - bypass store not yet implemented for Android. ")
    }

    @ReactMethod
    fun buySKU(skuPlatformID: String, developerPaywallID: String, resultsCallback: Callback) {
        var useActivity = currentActivity?.let {
            NamiPurchaseManager.buySKU(it, skuPlatformID, false) {

                // Currently not sure how to check if purchase worked?  Just return false.
                var resultArray: WritableArray = WritableNativeArray()
                resultArray.pushBoolean(false)
                resultsCallback.invoke(resultArray)
            }
        }
    }

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
//        val purchases = NamiPurchaseManager...

        // Pass back empty array until we can get purchases from the SDK
        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

}