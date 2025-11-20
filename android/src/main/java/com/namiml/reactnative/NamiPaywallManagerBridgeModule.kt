package com.namiml.reactnative

import android.app.Activity
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.namiml.paywall.NamiPaywallManager
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.model.NamiPurchaseSuccess

@ReactModule(name = NamiPaywallManagerBridgeModule.NAME)
class NamiPaywallManagerBridgeModule internal constructor(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), TurboModule {

    companion object {
        const val NAME = "RNNamiPaywallManager"
    }

    override fun getName(): String = NAME

    private var latestPaywallActivity: Activity? = null

    @ReactMethod
    fun buySkuComplete(dict: ReadableMap) {
        val product = dict.getMap("product")
        val productId = product?.getString("id")
        val skuRefId = product?.getString("skuId")
        val typeString = product?.getString("type")
        val storeType = dict.getString("storeType") ?: "GooglePlay"
        var purchaseSuccess: NamiPurchaseSuccess? = null

        if (productId != null && skuRefId != null) {
            val namiSku = NamiSKU.create(
                skuRefId = skuRefId,
                skuId = productId,
            )

            when (storeType) {
                "GooglePlay" -> {
                    val purchaseToken = dict.getString("purchaseToken")
                    val orderId = dict.getString("orderId")
                    if (purchaseToken != null && orderId != null) {
                        purchaseSuccess = NamiPurchaseSuccess.GooglePlay(
                            product = namiSku,
                            orderId = orderId,
                            purchaseToken = purchaseToken,
                        )
                    }
                }
                "Amazon" -> {
                    val receiptId = dict.getString("receiptId")
                    val localizedPrice = dict.getString("localizedPrice")
                    val userId = dict.getString("userId")
                    val marketplace = dict.getString("marketplace")
                    if (receiptId != null && localizedPrice != null && userId != null && marketplace != null) {
                        purchaseSuccess = NamiPurchaseSuccess.Amazon(
                            product = namiSku,
                            receiptId = receiptId,
                            localizedPrice = localizedPrice,
                            userId = userId,
                            marketplace = marketplace,
                        )
                    }
                }
            }

            if (purchaseSuccess != null) {
                val activity = latestPaywallActivity ?: reactApplicationContext.getCurrentActivity()
                if (activity != null) {
                    NamiPaywallManager.buySkuComplete(activity, purchaseSuccess)
                } else {
                    Log.w(NAME, "No activity available to complete purchase.")
                }
            } else {
                Log.d(NAME, "Unable to create a valid NamiPurchaseSuccess object. Purchase not completed.")
            }
        }
    }

    @ReactMethod
    fun registerCloseHandler() {
        NamiPaywallManager.registerCloseHandler { activity ->
            latestPaywallActivity = activity
            val map = Arguments.createMap().apply {
                putBoolean("paywallCloseRequested", true)
            }
            emitEvent("PaywallCloseRequested", map)
        }
    }

    @ReactMethod
    fun dismiss(promise: Promise) {
        latestPaywallActivity?.let {
            NamiPaywallManager.dismiss(it) { result -> promise.resolve(result) }
        } ?: promise.resolve(false)
    }

    @ReactMethod
    fun registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { activity, sku ->
            latestPaywallActivity = activity
            try {
                val dictionary = sku.toSkuDict()
                emitEvent("RegisterBuySKU", dictionary)
            } catch (e: Exception) {
                Log.e(NAME, "Failed to convert SKU: ${e.localizedMessage}")
            }
        }
    }

    @ReactMethod
    fun registerSignInHandler() {
        NamiPaywallManager.registerSignInHandler { activity ->
            latestPaywallActivity = activity
            val map = Arguments.createMap().apply {
                putBoolean("paywallSignInRequested", true)
            }
            emitEvent("PaywallSignInRequested", map)
        }
    }

    @ReactMethod
    fun registerRestoreHandler() {
        NamiPaywallManager.registerRestoreHandler { activity ->
            latestPaywallActivity = activity
            val map = Arguments.createMap().apply {
                putBoolean("paywallRestoreRequested", true)
            }
            emitEvent("PaywallRestoreRequested", map)
        }
    }

    @ReactMethod
    fun registerDeeplinkActionHandler() {
        NamiPaywallManager.registerDeepLinkHandler { activity, url ->
            latestPaywallActivity = activity
            emitEvent("PaywallDeeplinkAction", url)
        }
    }

    @ReactMethod
    fun show() {
        // No-op on Android
    }

    @ReactMethod
    fun hide() {
        // No-op on Android
    }

    @ReactMethod
    fun isHidden(promise: Promise) {
        promise.resolve(false)
    }

    @ReactMethod
    fun isPaywallOpen(promise: Promise) {
        promise.resolve(NamiPaywallManager.isPaywallOpen())
    }

    @ReactMethod
    fun buySkuCancel() {
        reactApplicationContext.runOnUiQueueThread {
            latestPaywallActivity?.let {
                NamiPaywallManager.buySkuCancel(it)
            } ?: reactApplicationContext.getCurrentActivity()?.let {
                NamiPaywallManager.buySkuCancel(it)
            } ?: NamiPaywallManager.buySkuCancel()
        }
    }

    @ReactMethod
    fun setProductDetails(productDetails: String, allowOffers: Boolean) {
        NamiPaywallManager.setProductDetails(productDetails, allowOffers)
    }

    @ReactMethod
    fun setAppSuppliedVideoDetails(url: String, name: String?) {
        NamiPaywallManager.setAppSuppliedVideoDetails(url, name)
    }

    @ReactMethod
    fun allowUserInteraction(allowed: Boolean) {
        NamiPaywallManager.allowPaywallInteraction(allow = allowed)
    }

    @ReactMethod fun addListener(eventName: String?) {}
    @ReactMethod fun removeListeners(count: Int?) {}

    private fun emitEvent(name: String, payload: Any?) {
        val emitter = reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        emitter.emit(name, payload)
    }
}
