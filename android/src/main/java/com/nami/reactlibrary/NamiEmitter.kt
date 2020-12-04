package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.billing.NamiPurchaseState
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiPaywall
import com.namiml.paywall.NamiPaywallManager
import com.namiml.paywall.NamiSKU
import java.util.*

class NamiEmitter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

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
            Log.i(LOG_TAG, "Products from registerApplicationPaywallProvider callback are $products")

            val sendProducts: List<NamiSKU> = products ?: ArrayList<NamiSKU>()
            emitPaywallRaise(paywallData, sendProducts, developerPaywallId)
        }

        NamiPurchaseManager.registerPurchasesChangedListener { list, namiPurchaseState, s ->
            emitPurchaseMade(list, namiPurchaseState, s)
        }
    }


    public fun emitEntitlementsChanged(entitlements: List<NamiEntitlement>) {
        val map = Arguments.createMap()


        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in entitlements) {
            val entitlementDict = entitlementDictFromEntitlement(entitlement)
            resultArray.pushMap(entitlementDict)
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


    public fun emitPurchaseMade(purchases: List<NamiPurchase>, purchaseState: NamiPurchaseState, errorString: String?) {
        val map = Arguments.createMap()
        errorString?.let {
            map.putString("errorDescription", errorString)
        }

        val resultArray: WritableArray = WritableNativeArray()
        for (purchase in purchases) {
            val purchaseDict = purchaseToPurchaseDict(purchase)
            resultArray.pushMap(purchaseDict)
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

    fun emitPaywallRaise(paywallData: NamiPaywall, productDicts: List<NamiSKU>, paywallDeveloperID: String?) {

        Log.i(LOG_TAG, "Emitting paywall raise signal for developerID$paywallDeveloperID");
        val map = Arguments.createMap().apply {
            putString("developerPaywallID", paywallDeveloperID)
        }

        // Populate paywall metadata map
        val paywallMap: WritableMap = paywallToPaywallDict(paywallData)
        if (paywallDeveloperID != null && paywallDeveloperID.isNotEmpty()) {
            paywallMap.putString("developer_paywall_id", paywallDeveloperID)
        }
        map.putMap("paywallMetadata", paywallMap)

        // Populate SKU details
        val skusArray: WritableArray = Arguments.createArray()

        for (sku in productDicts) {
            val skuMap = skuToSkuDict(sku)
            skusArray.pushMap(skuMap)
        }

        map.putArray("skus", skusArray)

        val paywallStyleData = paywallData.styleData
        if (paywallDeveloperID != null) {
            val paywallStyleDict = paywallStyleData?.let { paywallStylingToPaywallStylingDict(it) }
            map.putMap("styleData", paywallStyleDict)
        }

        try {
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("AppPaywallActivate", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    public fun emitSignInActivated(paywallData: NamiPaywall, paywallDeveloperID: String?) {

        val map = Arguments.createMap().apply {
            putString("developerPaywallID", paywallDeveloperID)
            putString("paywallMetadata", "Need TO Map NamiPaywall Object")
        }
        try {
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("SignInActivate", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    public fun emitPurchaseMade(paywallDeveloperID: String) {

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