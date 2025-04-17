package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.paywall.NamiPaywallManager
import com.namiml.paywall.NamiPurchaseSource
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.NamiSKUType
import com.namiml.paywall.model.NamiPurchaseSuccess
import java.util.*

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    var latestPaywallActivity: Activity? = null

    override fun getName(): String {
        return "RNNamiPaywallManager"
    }

    @ReactMethod
    fun buySkuComplete(dict: ReadableMap, storeType: String) {
        var product: ReadableMap? = null
        var productId: String? = null
        var skuRefId: String? = null
        var typeString: String? = null

        var skuType: NamiSKUType?

        var purchaseToken: String? = null
        var orderId: String? = null

        var receiptId: String? = null
        var localizedPrice: String? = null
        var userId: String? = null
        var marketplace: String? = null

        if (dict.hasKey("product")) {
            product = dict.getMap("product")
        }

        if (product != null) {
            if (product.hasKey("id")) {
                productId = product.getString("id")
            }

            if (product.hasKey("skuId")) {
                skuRefId = product.getString("skuId")
            }

            if (product.hasKey("type")) {
                typeString = product.getString("type")
            }
        }

        if (productId != null && skuRefId != null) {
            val namiSku = NamiSKU.create(
                skuRefId = skuRefId,
                skuId = productId,
            )
            var purchaseSuccess: NamiPurchaseSuccess? = null

            if (storeType == "GooglePlay") {
                if (dict.hasKey("purchaseToken")) {
                    purchaseToken = dict.getString("purchaseToken")
                }
                if (dict.hasKey("orderId")) {
                    orderId = dict.getString("orderId")
                }
                Log.d(LOG_TAG, "$namiSku $purchaseToken $orderId")

                if (namiSku != null && purchaseToken != null && orderId != null) {
                    purchaseSuccess = NamiPurchaseSuccess.GooglePlay(
                        product = namiSku,
                        orderId = orderId,
                        purchaseToken = purchaseToken,
                    )
                }
            } else if (storeType == "Amazon") {
                if (dict.hasKey("receiptId")) {
                    receiptId = dict.getString("receiptId")
                }
                if (dict.hasKey("localizedPrice")) {
                    localizedPrice = dict.getString("localizedPrice")
                }
                if (dict.hasKey("userId")) {
                    userId = dict.getString("userId")
                }
                if (dict.hasKey("marketplace")) {
                    marketplace = dict.getString("marketplace")
                }
                if (namiSku != null && receiptId != null && localizedPrice != null && userId != null && marketplace != null) {
                    purchaseSuccess = NamiPurchaseSuccess.Amazon(
                        product = namiSku,
                        receiptId = receiptId,
                        localizedPrice = localizedPrice,
                        userId = userId,
                        marketplace = marketplace,
                    )
                }
            }

            if (purchaseSuccess != null) {
                if (latestPaywallActivity != null) {
                    NamiPaywallManager.buySkuComplete(latestPaywallActivity!!, purchaseSuccess)
                } else {
                    NamiPaywallManager.buySkuComplete(currentActivity!!, purchaseSuccess)
                }
            } else {
                Log.d(LOG_TAG, "Unable to create a valid NamiPurchaseSuccess object, so buySkuComplete will not succeed. Paywall conversion will not be reported for this purchase.")
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
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("PaywallCloseRequested", map)
        }
    }

    @ReactMethod
    fun dismiss(promise: Promise) {
        if (latestPaywallActivity != null) {
            val paywallActivity = latestPaywallActivity as Activity
            NamiPaywallManager.dismiss(paywallActivity, completionHandler = {
                promise.resolve(it)
            })
        }
    }

    @ReactMethod
    fun registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { activity, sku ->
            latestPaywallActivity = activity
            val dictionary = sku.toSkuDict()
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("RegisterBuySKU", dictionary)
        }
    }

    @ReactMethod
    fun registerSignInHandler() {
        NamiPaywallManager.registerSignInHandler { activity ->
            latestPaywallActivity = activity
            val map = Arguments.createMap().apply {
                putBoolean("paywallSignInRequested", true)
            }
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("PaywallSignInRequested", map)
        }
    }

    @ReactMethod
    fun registerRestoreHandler() {
        NamiPaywallManager.registerRestoreHandler { activity ->
            latestPaywallActivity = activity
            val map = Arguments.createMap().apply {
                putBoolean("paywallRestoreRequested", true)
            }
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("PaywallRestoreRequested", map)
        }
    }

    @ReactMethod
    fun registerDeeplinkActionHandler() {
        NamiPaywallManager.registerDeepLinkHandler { activity, url ->
            latestPaywallActivity = activity
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("PaywallDeeplinkAction", url)
        }
    }

    @ReactMethod
    fun show() {
        // Do nothing on Android side
    }

    @ReactMethod
    fun hide() {
        // Do nothing on Android side
    }

    @ReactMethod
    fun isHidden(promise: Promise) {
        // Do nothing on Android side
        promise.resolve(false)
    }

    @ReactMethod
    fun isPaywallOpen(promise: Promise) {
        val paywallOpen = NamiPaywallManager.isPaywallOpen()
        promise.resolve(paywallOpen)
    }

    @ReactMethod
    fun buySkuCancel() {
        reactApplicationContext.runOnUiQueueThread {
            if (latestPaywallActivity != null) {
                NamiPaywallManager.buySkuCancel(latestPaywallActivity!!)
            } else if (currentActivity != null) {
                NamiPaywallManager.buySkuCancel(currentActivity!!)
            } else {
                NamiPaywallManager.buySkuCancel()
            }
        }
    }

    @ReactMethod
    fun setProductDetails(productDetails: String, allowOffers: Boolean) {
        NamiPaywallManager.setProductDetails(productDetails, allowOffers = allowOffers)
    }

    @ReactMethod
    fun setAppSuppliedVideoDetails(url: String, name: String?) {
        NamiPaywallManager.setAppSuppliedVideoDetails(url = url, name = name)
    }

    @ReactMethod
    fun allowUserInteraction(allowed: Boolean) {
        // NamiPaywallManager.allowUserInteraction(allow = allowed)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?,
    ) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }
}
