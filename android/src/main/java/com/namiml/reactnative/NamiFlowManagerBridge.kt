package com.namiml.reactnative

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.namiml.flow.NamiFlowManager

@ReactModule(name = NamiFlowManagerBridgeModule.NAME)
class NamiFlowManagerBridgeModule internal constructor(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext), TurboModule {

    companion object {
        const val NAME = "RNNamiFlowManager"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun registerStepHandoff() {
        NamiFlowManager.registerStepHandoff { handoffTag, handoffData ->
            val payload = Arguments.createMap().apply {
                putString("handoffTag", handoffTag)
                if (handoffData != null) {
                    try {
                        val map = Arguments.makeNativeMap(handoffData)
                        putMap("handoffData", map)
                    } catch (e: Exception) {
                        Log.d(NAME, "Failed to convert handoffData to NativeMap: ${e.localizedMessage}")
                    }
                }
            }
            sendEvent("Handoff", payload)
        }
    }

    @ReactMethod
    fun registerEventHandler() {
        NamiFlowManager.registerEventHandler { data ->
            val payload = Arguments.makeNativeMap(data)
            sendEvent("FlowEvent", payload)
        }
    }

    @ReactMethod
    fun resume() {
        Handler(Looper.getMainLooper()).postDelayed({
            NamiFlowManager.resume()
        }, 100L)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Required for RN EventEmitter support
    @ReactMethod fun addListener(eventName: String?) {}
    @ReactMethod fun removeListeners(count: Int?) {}
}
