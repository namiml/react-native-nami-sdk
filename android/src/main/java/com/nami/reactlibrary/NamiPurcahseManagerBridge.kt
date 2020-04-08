package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    @ReactMethod
    fun buySKU(skuPlatformID: String, resultsCallback: Callback) {
        var useActivity = currentActivity?.let {
            NamiPurchaseManager.buySKU(it, skuPlatformID, false) {
                var resultArray: WritableArray = WritableNativeArray()
                resultsCallback.invoke(resultArray)
            }
        }
    }

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
        var resultArray: WritableArray = WritableNativeArray()
        var sendMap = WritableNativeMap()
        sendMap.putString("key1", "data");
        resultArray.pushMap(sendMap)

        resultsCallback.invoke(resultArray)
    }

}