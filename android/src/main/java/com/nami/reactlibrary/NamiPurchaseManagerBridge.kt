package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchaseManager
import com.namiml.paywall.NamiPaywallManager

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiPurchaseManager"
    }

    @ReactMethod
    fun clearBypassStorePurchases() {
        reactApplicationContext.runOnUiQueueThread {
            NamiPurchaseManager.clearBypassStorePurchases()
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
    fun skuPurchased(skuID: String, promise: Promise) {
        val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)
        promise.resolve(isPurchased)
    }

    @ReactMethod
    fun consumePurchasedSku(skuRefId: String) {
        reactApplicationContext.runOnUiQueueThread {
            NamiPurchaseManager.consumePurchasedSKU(skuRefId)
        }
    }

    @ReactMethod
    fun anySkuPurchased(skuIDs: ReadableArray, promise: Promise) {
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

            promise.resolve(anyPurchased)
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

    @ReactMethod
    fun registerPurchasesChangedHandler() {
        NamiPurchaseManager.registerPurchasesChangedHandler{purchases, purchaseState, error ->
            run {
                val resultPurchases: WritableArray = WritableNativeArray()

                for (purchase in purchases) {
                    resultPurchases.pushMap(purchase.toPurchaseDict())
                }

                val stateString = purchaseState.toString()

                val payload = Arguments.createMap()
                payload.putArray("purchases", resultPurchases)
                payload.putString("purchaseState", stateString)
                payload.putString("error", error)

                reactApplicationContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("PurchasesChanged", payload)


            }
        }
    }
}
