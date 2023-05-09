package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.android.billingclient.api.Purchase
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.paywall.NamiPaywallManager
import com.namiml.paywall.PreparePaywallResult

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var blockRaisePaywall: Boolean = false

    override fun getName(): String {
        return "RNNamiPaywallManager"
    }

    @ReactMethod
    fun buySkuComplete(purchase: WritableMap, skuRefId: String) {
//        NamiPaywallManager.buySkuComplete(currentActivity!!, purchase, skuRefId)
    }


    @ReactMethod
    fun registerCloseHandler(blockDismiss: Boolean) {
        NamiPaywallManager.registerCloseHandler { activity ->
            val resultMap = Arguments.createMap()
            resultMap.putBoolean("blockingPaywallClosed", true)
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("BlockingPaywallClosed", resultMap)
            if (!blockDismiss) {
                activity.finish()
            }
        }
    }

    @ReactMethod
    fun registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { buySkuHandler, status ->
//            reactApplicationContext
//                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
//                    .emit("RegisterBuySKU")
        }
    }


    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
        if (NamiPaywallManager.didUserCloseBlockingNamiPaywall(requestCode, resultCode)) {
            Log.i(
                LOG_TAG, "User closed blocking paywall, sending event.  " +
                    "Activity was." + activity.toString()
            )
            emitBockedPaywallClosed()
        }
    }

    private fun emitBockedPaywallClosed() {
        val map = Arguments.createMap().apply {
            putBoolean("blockingPaywallClosed", true)
        }
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("BlockingPaywallClosed", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

//    @ReactMethod
//    fun blockRaisePaywall(blockRaise: Boolean) {
//        blockRaisePaywall = blockRaise
//    }

}
