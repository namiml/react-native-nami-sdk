package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.namiml.billing.NamiPurchaseManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    @ReactMethod
    fun clearBypassStorePurchases() {
        reactApplicationContext.runOnUiQueueThread {
            NamiPurchaseManager.clearBypassStorePurchases()
        }
    }

    @ReactMethod
    fun buySKU(skuPlatformID: String, developerPaywallID: String, resultsCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
            currentActivity?.let {
                NamiPurchaseManager.buySKU(it, skuPlatformID) {

                    val result: Boolean
                    if (NamiPurchaseManager.isSKUIDPurchased(skuPlatformID)) {
                        result = true
                        Log.i(LOG_TAG, "Purchase complete, result is PURCHASED.")
                    } else {
                        result = false
                        Log.i(LOG_TAG, "Purchase complete, product not purchased.")
                    }
                    resultsCallback.invoke(result)
                }
            }
        }
    }

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
            val purchases = NamiPurchaseManager.allPurchases()

            // Pass back empty array until we can get purchases from the SDK
            val resultArray: WritableArray = WritableNativeArray()

            for (purchase in purchases) {
                resultArray.pushMap(purchase.toPurchaseDict())
            }

            resultsCallback.invoke(resultArray)
        }
    }

    @ReactMethod
    fun isSKUIDPurchased(skuID: String, resultsCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
            val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)
            resultsCallback.invoke(isPurchased)
        }
    }

    @ReactMethod
    fun consumePurchasedSKU(skuRefId: String) {
        reactApplicationContext.runOnUiQueueThread {
            NamiPurchaseManager.consumePurchasedSKU(skuRefId)
        }
    }

    @ReactMethod
    fun anySKUIDPurchased(skuIDs: ReadableArray, resultsCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
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
    }

    @ReactMethod
    fun restorePurchases(resultsCallback: Callback) {
        Log.w(LOG_TAG, "Restore Purchases called on Android platform, has no effect on Android.")

        val resultMap = WritableNativeMap().apply {
            putBoolean("success", false)
            putString(
                "error",
                "Google Play does not provide an API method to restore purchases.  Deep link users to Play app subscriptions to restore purchases."
            )
        }
        resultsCallback.invoke(resultMap)
    }
}