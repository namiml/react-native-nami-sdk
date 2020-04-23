package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.billing.NamiPurchaseManager
import com.namiml.entitlement.NamiEntitlementManager
import com.namiml.entitlement.NamiEntitlementSetter

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

        val firstEntitlement = entitlements.first()

        val referenceID = firstEntitlement.namiId //???
        val name = firstEntitlement.name
        val desc = firstEntitlement.desc
        val relatedSkus = firstEntitlement.relatedSKUs
        val activePurcahses = firstEntitlement.activePurchases
        val isActive = firstEntitlement.isActive()

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun getEntitlements(resultsCallback: Callback) {

        // TODO: add get entitlements to Android

        var resultArray: WritableArray = WritableNativeArray()
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun setEntitlements(entitlements: ReadableMap) {

        var referenceID: String = ""
        if (entitlements.hasKey("referenceID")) {
            referenceID = entitlements.getString("referenceID") ?: ""
        }

        if (referenceID.length != 0)
        {
            var namiSetter = NamiEntitlementSetter(referenceId = "")
            namiSetter.expires = ///???  String should be date?
            namiSetter.platform = android
            namiSetter.purchasedSKUid = ""
        }
    }

}