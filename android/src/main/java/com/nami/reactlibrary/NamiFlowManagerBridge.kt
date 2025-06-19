package com.nami.reactlibrary

import android.os.Handler
import android.os.Looper
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
        val delayMillis = 100L

        Handler(Looper.getMainLooper()).postDelayed({
            NamiFlowManager.resume()
        }, delayMillis)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }
}
