package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager
import com.namiml.entitlement.NamiEntitlementManager

class NamiEntitlementManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiEntitlementManagerBridge"
    }

    @ReactMethod
    fun isEntitlementActive(entitlementRefID: String, resultsCallback: Callback) {

        val isActive = NamiEntitlementManager.isEntitlementActive(entitlementRefID)
        var resultMap: WritableMap = WritableNativeMap()
        resultMap.putBoolean("active", isActive)
        resultsCallback.invoke(resultMap)
    }

    @ReactMethod
    fun activeEntitlements(resultsCallback: Callback) {

        val entitlements = NamiEntitlementManager.activeEntitlements()

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun getEntitlements(resultsCallback: Callback) {

        // TODO: add get entitlements to Android

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

}