package com.nami.reactlibrary

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.flow.NamiFlowManager

class NamiFlowManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RNNamiFlowManager"

    @ReactMethod
    fun registerStepHandoff() {
        NamiFlowManager.registerStepHandoff { handoffTag, handoffData ->
            val payload = Arguments.createMap().apply {
                putString("handoffTag", handoffTag)
                if (handoffData != null) {
                    putMap("handoffData", Arguments.makeNativeMap(handoffData))
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