package com.nami.reactlibrary

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.flow.NamiFlowManager

class NamiFlowManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var eventHandler: ((WritableMap) -> Unit)? = null

    override fun getName(): String {
        return "RNNamiFlowManager"
    }

    @ReactMethod
    fun registerStepHandoff() {
        NamiFlowManager.registerStepHandoff { handoffTag, handoffData ->
            val payload = Arguments.createMap().apply {
                putString("handoffTag", handoffTag)
                if (handoffData != null) {
                    putMap("handoffData", Arguments.makeNativeMap(handoffData))
                }
            }
            sendEvent("RegisterStepHandoff", payload)
        }
    }

    @ReactMethod
    fun registerEventHandler(callback: Callback) {
        eventHandler = { payload ->
            callback.invoke(payload)
        }
    }

    @ReactMethod
    fun resume() {
        NamiFlowManager.resume()
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
