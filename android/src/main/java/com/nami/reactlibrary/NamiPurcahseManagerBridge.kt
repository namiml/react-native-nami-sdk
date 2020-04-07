package com.nami.reactlibrary

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.util.Log
import com.facebook.react.bridge.*


import com.namiml.BuildConfig
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLogLevel
import com.namiml.NamiPaywallManager
import com.namiml.api.model.NamiPaywall
import com.namiml.entitlement.billing.NamiPurchaseManager

import org.jetbrains.annotations.NotNull

import java.util.ArrayList

public class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    public override fun getName(): String  {
        return "NamiPurchaseManagerBridge"
    }

    @ReactMethod
    public fun buySKU(skuPlatformID: String, resultsCallback: Callback ) {
    var useActivity = currentActivity?.let {
        NamiPurchaseManager.buySKU(it, skuPlatformID, false) {
            var resultArray : WritableArray = WritableNativeArray()
            resultsCallback.invoke(resultArray)
            }
        }
    }

    @ReactMethod
    public fun purchases(resultsCallback: Callback ) {
        var resultArray : WritableArray = WritableNativeArray()
        var sendMap = WritableNativeMap()
        sendMap.putString("key1", "data");
        resultArray.pushMap(sendMap)

        resultsCallback.invoke(resultArray)
    }

}