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
import com.namiml.customer.CustomerJourneyState
import com.namiml.customer.NamiCustomerManager
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
//        NamiPaywallManager.registerSignInListener { _, _, developerPaywallID ->
//            Log.i(LOG_TAG, "Sign in clicked with developerPaywallID $developerPaywallID")
//
//            emitSignInActivated(developerPaywallID)
//        }

        Log.i(LOG_TAG, "In Emitter Initialize()")

//        NamiPaywallManager.registerPaywallRaiseListener { _, paywallData, products, developerPaywallId ->
//            Log.i(
//                LOG_TAG,
//                "Products from registerPaywallRaiseListener callback are $products"
//            )
//
//            val sendProducts: List<NamiSKU> = products ?: ArrayList<NamiSKU>()
//            emitPaywallRaise(paywallData, sendProducts, developerPaywallId)
//        }

//        NamiPurchaseManager.registerPurchasesChangedListener { list, namiPurchaseState, s ->
//            emitPurchaseMade(list, namiPurchaseState, s)
//        }
//
//        NamiCustomerManager.registerCustomerJourneyChangedListener {
//            emitCustomerJourneyChanged(it)
//        }
    }

    private fun emitCustomerJourneyChanged(customerJourneyState: CustomerJourneyState) {
        Log.i(LOG_TAG, "Emitting CustomerJourneyChanged $customerJourneyState")
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("CustomerJourneyStateChanged", customerJourneyState.toDict())
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    private fun emitPurchaseMade(
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

    private fun emitPaywallRaise(
        namiPaywall: NamiPaywall,
        productDicts: List<NamiSKU>,
        paywallDeveloperID: String?
    ) {

        Log.i(LOG_TAG, "Emitting paywall raise signal for developerID$paywallDeveloperID")
        val map = Arguments.createMap().apply {
            putString("developerPaywallID", paywallDeveloperID)
        }

        // Populate paywall metadata map
        // val paywallMap: WritableMap = namiPaywall.toNamiPaywallDict()
        // map.putMap("paywallMetadata", paywallMap)

        // Populate SKU details
        val skusArray: WritableArray = Arguments.createArray()

        for (sku in productDicts) {
            skusArray.pushMap(sku.toSkuDict())
        }

        map.putArray("namiSkus", skusArray)

        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AppPaywallActivate", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    private fun emitSignInActivated(paywallDeveloperID: String?) {

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
}
