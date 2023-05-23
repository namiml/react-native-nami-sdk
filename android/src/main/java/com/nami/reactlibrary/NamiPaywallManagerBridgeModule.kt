package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.android.billingclient.api.Purchase
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.paywall.*
import com.namiml.paywall.model.NamiPurchaseSuccess
import java.text.SimpleDateFormat
import java.util.Date

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    override fun getName(): String {
        return "RNNamiPaywallManager"
    }

    @ReactMethod
    fun buySkuComplete(dict: ReadableMap, storeType: String) {
        var product = dict.getMap("product")
        var name = product?.getString("name")
        var featured = product?.getBoolean("featured")
        var productId = product?.getString("id")
        var skuId = product?.getString("skuId")
        var typeInt = product?.getInt("type")
        var purchaseSourceString = dict.getString("purchaseSource")
        var purchaseDateInt = dict.getInt("purchaseDate")
        var expiresDateInt = dict.getInt("expiresDate")
        val type = when (typeInt) {
            0 -> {
                NamiSKUType.UNKNOWN
            }
            1 -> {
                NamiSKUType.SUBSCRIPTION
            }
            2 -> {
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

        if (name != null && skuId != null && featured != null) {
            val namiSku = NamiSKU(
                    skuId = skuId,
                    skuDetails = null,
                    amazonProduct = null,
                    id = productId,
                    type = type,
                    name = name,
                    featured = featured,
                    rawDisplayText = null,
                    rawSubDisplayText = null,
                    entitlements = emptyList(),
                    variables = null
            )
            val purchaseDate = Date(purchaseDateInt * 1000L)
            var expiresDate = Date(expiresDateInt * 1000L )
            var purchaseSuccess: NamiPurchaseSuccess? = null;
            if (storeType == "GooglePlay") {
                var purchaseToken = dict.getString("purchaseToken")
                var orderId = dict.getString("orderId")
                if (purchaseToken != null && orderId != null) {
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
                var receiptId = dict.getString("receiptId")
                var localizedPrice = dict.getString("localizedPrice")
                var userId = dict.getString("userId")
                var marketplace = dict.getString("marketplace")
                if (receiptId != null && localizedPrice != null && userId != null && marketplace != null) {
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
            }
        }
    }


    @ReactMethod
    fun registerCloseHandler() {
        NamiPaywallManager.registerCloseHandler { activity ->
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("PaywallCloseRequested")
        }
    }

    @ReactMethod
    fun registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { activity, sku ->
            val dictionary = sku.toSkuDict()
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("RegisterBuySKU", dictionary)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

}
