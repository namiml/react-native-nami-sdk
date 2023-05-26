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
        var skuId: String? = null
        var typeString: String? = null
        var purchaseSourceString: String? = null
        var expiresDateInt: Int? = null
        var purchaseDateInt: Int? = null

        var expiresDate: Date? = null
        var purchaseDate: Date? = null

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
                skuId = product.getString("skuId")
            }

            if (product.hasKey("type")) {
                typeString = product.getString("type")
            }
        }

        if (dict.hasKey("purchaseSource")) {
            purchaseSourceString = dict.getString("purchaseSource")
        }

        if (dict.hasKey("expiresDate")) {
            expiresDateInt = dict.getInt("expiresDate")
            expiresDate = Date(expiresDateInt * 1000L)
        }
        if (dict.hasKey("purchaseDate")) {
            purchaseDateInt = dict.getInt("purchaseDate")
            purchaseDate = Date(purchaseDateInt * 1000L)
        }

        skuType = when (typeString) {
            "UNKNOWN" -> {
                NamiSKUType.UNKNOWN
            }
            "SUBSCRIPTION" -> {
                NamiSKUType.SUBSCRIPTION
            }
            "ONE_TIME_PURCHASE" -> {
                NamiSKUType.ONE_TIME_PURCHASE
            }
            else -> {
                NamiSKUType.UNKNOWN
            }
        }

        val purchaseSource = when (purchaseSourceString) {
            "CAMPAIGN" -> {
                NamiPurchaseSource.CAMPAIGN
            }
            "MARKETPLACE" -> {
                NamiPurchaseSource.MARKETPLACE
            }
            "UNKNOWN" -> {
                NamiPurchaseSource.UNKNOWN
            }
            else -> {
                NamiPurchaseSource.UNKNOWN
            }
        }

        if (productId != null && skuId != null && skuType != null) {
            val namiSku = NamiSKU(
                skuId = skuId,
                skuDetails = null,
                amazonProduct = null,
                id = productId,
                type = skuType,
                name = "",
                featured = false,
                rawDisplayText = null,
                rawSubDisplayText = null,
                entitlements = emptyList(),
                variables = null,
            )
            var purchaseSuccess: NamiPurchaseSuccess? = null

            if (storeType == "GooglePlay") {
                if (dict.hasKey("purchaseToken")) {
                    purchaseToken = dict.getString("purchaseToken")
                }
                if (dict.hasKey("orderId")) {
                    orderId = dict.getString("orderId")
                }
                Log.d(LOG_TAG, "$namiSku $purchaseToken $orderId $purchaseDateInt $purchaseDate")

                if (namiSku != null && purchaseToken != null && orderId != null && purchaseDate != null) {
                    purchaseSuccess = NamiPurchaseSuccess.GooglePlay(
                        product = namiSku,
                        expiresDate = expiresDate,
                        purchaseDate = purchaseDate,
                        purchaseSource = purchaseSource,
                        description = null,
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
                if (namiSku != null && receiptId != null && localizedPrice != null && userId != null && marketplace != null && purchaseDate != null) {
                    purchaseSuccess = NamiPurchaseSuccess.Amazon(
                        product = namiSku,
                        expiresDate = expiresDate,
                        purchaseDate = purchaseDate,
                        purchaseSource = purchaseSource,
                        description = null,
                        receiptId = receiptId,
                        localizedPrice = localizedPrice,
                        userId = userId,
                        marketplace = marketplace,
                    )
                }
            }

            if (purchaseSuccess != null) {
                NamiPaywallManager.buySkuComplete(currentActivity!!, purchaseSuccess)
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
    fun dismiss(animated: Boolean) {
        if (latestPaywallActivity != null) {
            val paywallActivity = latestPaywallActivity as Activity
            paywallActivity.finish()
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
