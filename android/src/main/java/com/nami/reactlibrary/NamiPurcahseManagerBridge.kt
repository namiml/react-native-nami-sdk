package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    @ReactMethod
    fun buySKU(skuPlatformID: String, resultsCallback: Callback) {
       buySKU(skuPlatformID, "", resultsCallback)
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