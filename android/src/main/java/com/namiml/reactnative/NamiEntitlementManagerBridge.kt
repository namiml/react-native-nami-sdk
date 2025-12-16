package com.namiml.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.entitlement.NamiEntitlementManager
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule

@ReactModule(name = NamiEntitlementManagerBridgeModule.NAME)
class NamiEntitlementManagerBridgeModule internal constructor(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), TurboModule {

    // Capture the context early to avoid bridge destruction issues
    private val capturedContext = reactContext

    companion object {
        const val NAME = "RNNamiEntitlementManager"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun isEntitlementActive(referenceId: String, promise: Promise) {
        val isEntitlementActive = NamiEntitlementManager.isEntitlementActive(referenceId)
        promise.resolve(isEntitlementActive)
    }

    @ReactMethod
    fun active(promise: Promise) {
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
    fun refresh() {
        NamiEntitlementManager.refresh { activeNativeEntitlements ->
            val resultArray: WritableArray = WritableNativeArray()
            if (activeNativeEntitlements != null) {
                for (entitlement in activeNativeEntitlements) {
                    entitlement.toEntitlementDict()?.let { entitlementDict ->
                        resultArray.pushMap(entitlementDict)
                    }
                }
            }
            try {
                if (capturedContext.hasActiveCatalystInstance()) {
                    capturedContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        ?.emit("EntitlementsChanged", resultArray)
                } else {
                    android.util.Log.w(NAME, "Cannot emit EntitlementsChanged: Bridge has been destroyed or is inactive")
                }
            } catch (e: Exception) {
                android.util.Log.w(NAME, "Error emitting EntitlementsChanged event: ${e.message}")
            }
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
            try {
                if (capturedContext.hasActiveCatalystInstance()) {
                    capturedContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        ?.emit("EntitlementsChanged", resultArray)
                } else {
                    android.util.Log.w(NAME, "Cannot emit EntitlementsChanged: Bridge has been destroyed or is inactive")
                }
            } catch (e: Exception) {
                android.util.Log.w(NAME, "Error emitting EntitlementsChanged event: ${e.message}")
            }
        }
    }

    @ReactMethod
    fun clearProvisionalEntitlementGrants() {
        NamiEntitlementManager.clearProvisionalEntitlementGrants()
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for React Native event emitter support
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Required for React Native event emitter support
    }
}
