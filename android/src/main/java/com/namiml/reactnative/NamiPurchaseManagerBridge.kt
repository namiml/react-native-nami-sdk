package com.namiml.reactnative

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.namiml.billing.NamiPurchaseManager

@ReactModule(name = NamiPurchaseManagerBridgeModule.NAME)
class NamiPurchaseManagerBridgeModule internal constructor(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), TurboModule {

    companion object {
        const val NAME = "RNNamiPurchaseManager"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
        reactContext.runOnUiQueueThread {
            val purchases = NamiPurchaseManager.allPurchases()
            val resultArray = WritableNativeArray()

            purchases.forEach { purchase ->
                try {
                    resultArray.pushMap(purchase.toPurchaseDict())
                } catch (e: Exception) {
                    Log.e(NAME, "Error converting purchase to map", e)
                }
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
        reactContext.runOnUiQueueThread {
            NamiPurchaseManager.consumePurchasedSKU(skuRefId)
        }
    }

    @ReactMethod
    fun anySkuPurchased(skuIDs: ReadableArray, promise: Promise) {
        reactContext.runOnUiQueueThread {
            val checkArray = mutableListOf<String>()

            for (i in 0 until skuIDs.size()) {
                if (skuIDs.getType(i) == ReadableType.String) {
                    skuIDs.getString(i)?.takeIf { it.isNotBlank() }?.let { checkArray.add(it) }
                }
            }

            val anyPurchased = NamiPurchaseManager.anySKUIDPurchased(checkArray)
            promise.resolve(anyPurchased)
        }
    }

    @ReactMethod
    fun restorePurchases(resultsCallback: Callback) {
        Log.w(NAME, "Restore Purchases called on Android platform; no-op.")

        val resultMap = WritableNativeMap().apply {
            putBoolean("success", false)
            putString(
                "error",
                "Google Play or Amazon Appstore on Android devices do not provide a restore purchases API."
            )
        }

        resultsCallback.invoke(resultMap)
    }

    @ReactMethod
    fun registerPurchasesChangedHandler() {
        NamiPurchaseManager.registerPurchasesChangedHandler { purchases, purchaseState, error ->
            val resultPurchases = WritableNativeArray().apply {
                purchases.forEach {
                    try {
                        pushMap(it.toPurchaseDict())
                    } catch (e: Exception) {
                        Log.e(NAME, "Failed to map purchase", e)
                    }
                }
            }

            val payload = Arguments.createMap().apply {
                putArray("purchases", resultPurchases)
                putString("purchaseState", purchaseState.toString())
                putString("error", error)
            }

            emitEvent("PurchasesChanged", payload)
        }
    }

    private fun emitEvent(eventName: String, payload: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, payload)
    }

    @ReactMethod fun addListener(eventName: String?) {}
    @ReactMethod fun removeListeners(count: Int?) {}
}
