package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.billing.NamiPurchaseState
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiPaywall
import com.namiml.paywall.NamiPaywallManager
import com.namiml.paywall.NamiSKU
import java.util.ArrayList

class NamiEmitter(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun onCatalystInstanceDestroy() {
    }

    override fun getName(): String {
        return NamiEmitter::class.java.simpleName
    }

    override fun canOverrideExistingModule(): Boolean {
        return false
    }

    override fun initialize() {
        NamiPaywallManager.registerSignInListener { context, paywallData, developerPaywallID ->
            Log.i(LOG_TAG, "Sign in clicked with developerPaywallID $developerPaywallID")

            emitSignInActivated(paywallData, developerPaywallID)
        }

        Log.i(LOG_TAG, "In Emitter Initialize()")

        NamiPaywallManager.registerPaywallRaiseListener { context, paywallData, products, developerPaywallId ->
            Log.i(
                LOG_TAG,
                "Products from registerPaywallRaiseListener callback are $products"
            )

            val sendProducts: List<NamiSKU> = products ?: ArrayList<NamiSKU>()
            emitPaywallRaise(paywallData, sendProducts, developerPaywallId)
        }

        NamiPurchaseManager.registerPurchasesChangedListener { list, namiPurchaseState, s ->
            emitPurchaseMade(list, namiPurchaseState, s)
        }
    }

    fun emitEntitlementsChanged(entitlements: List<NamiEntitlement>) {
        val map = Arguments.createMap()

        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in entitlements) {
            resultArray.pushMap(entitlement.toEntitlementDict())
        }
        map.putArray("entitlements", resultArray)

        Log.i(LOG_TAG, "Emitting entitlements changed")
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("EntitlementsChanged", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    fun emitPurchaseMade(
        purchases: List<NamiPurchase>,
        purchaseState: NamiPurchaseState,
        errorString: String?
    ) {
        val map = Arguments.createMap()
        errorString?.let {
            map.putString("error", errorString)
        }

        val resultArray: WritableArray = WritableNativeArray()
        for (purchase in purchases) {
            resultArray.pushMap(purchase.toPurchaseDict())
        }
        map.putArray("purchases", resultArray)

        val convertedState: String = when (purchaseState) {
            NamiPurchaseState.PURCHASED -> {
                "PURCHASED"
            }
            NamiPurchaseState.FAILED -> {
                "FAILED"
            }
            NamiPurchaseState.CANCELLED -> {
                "CANCELLED"
            }
            else -> {
                "UNKNOWN"
            }
        }
        map.putString("purchaseState", convertedState)


        Log.i(LOG_TAG, "Emitting purchase with state $convertedState")
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("PurchasesChanged", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    fun emitPaywallRaise(
        namiPaywall: NamiPaywall,
        productDicts: List<NamiSKU>,
        paywallDeveloperID: String?
    ) {

        Log.i(LOG_TAG, "Emitting paywall raise signal for developerID$paywallDeveloperID")
        val map = Arguments.createMap().apply {
            putString("developerPaywallID", paywallDeveloperID)
        }

        // Populate paywall metadata map
        val paywallMap: WritableMap = namiPaywall.toNamiPaywallDict()
        map.putMap("paywallMetadata", paywallMap)

        // Populate SKU details
        val skusArray: WritableArray = Arguments.createArray()

        for (sku in productDicts) {
            skusArray.pushMap(sku.toSkuDict())
        }

        map.putArray("skus", skusArray)

        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AppPaywallActivate", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    fun emitSignInActivated(paywallData: NamiPaywall, paywallDeveloperID: String?) {

        val map = Arguments.createMap().apply {
            putString("developerPaywallID", paywallDeveloperID)
        }
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("SignInActivate", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    fun emitPurchaseMade(paywallDeveloperID: String) {

        val map = Arguments.createMap().apply {
            putString("key1", "Value1")
            putString("key1", "Value1")
        }
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("customEventName", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }
}