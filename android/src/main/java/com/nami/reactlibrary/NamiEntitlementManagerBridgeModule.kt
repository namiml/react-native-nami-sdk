package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.entitlement.NamiEntitlement
import com.namiml.entitlement.NamiEntitlementManager
//import com.namiml.entitlement.NamiEntitlementSetter
import com.namiml.entitlement.NamiPlatformType
import java.util.ArrayList
import java.util.Date
import com.facebook.react.bridge.Callback

class NamiEntitlementManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiEntitlementManager"
    }

    @ReactMethod
    fun isEntitlementActive(referenceId: String, promise: Promise){
        val isEntitlementActive = NamiEntitlementManager.isEntitlementActive(referenceId)
        promise.resolve(isEntitlementActive)
    }

    @ReactMethod
    fun active(promise: Promise){
        val nativeEntitlements = NamiEntitlementManager.active()
        val resultArray: WritableArray = WritableNativeArray()
        for (entitlement in nativeEntitlements) {
            entitlement.toEntitlementDict()?.let { entitlementDict ->
                resultArray.pushMap(entitlementDict)
           }
        }
        promise.resolve(resultArray)
    }

    @ReactMethod
    fun refresh(callback: Callback){
        NamiEntitlementManager.refresh { activeNativeEntitlements ->
            val resultArray: WritableArray = WritableNativeArray()
            if (activeNativeEntitlements != null) {
                for (entitlement in activeNativeEntitlements) {
                    entitlement.toEntitlementDict()?.let { entitlementDict ->
                        resultArray.pushMap(entitlementDict)
                    }
                }
            }
            callback.invoke(resultArray)
        }
    }

    @ReactMethod
    fun registerActiveEntitlementsHandler() {
        NamiEntitlementManager.registerActiveEntitlementsHandler { activeNativeEntitlements ->
            val resultArray: WritableArray = WritableNativeArray()
            for (entitlement in activeNativeEntitlements) {
                entitlement.toEntitlementDict()?.let { entitlementDict ->
                    resultArray.pushMap(entitlementDict)
                }
            }
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("EntitlementsChanged", resultArray)
        }
    }
}
