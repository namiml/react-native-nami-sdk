package com.nami.reactlibrary

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
//import com.namiml.customer.NamiFlowManager

class NamiFlowManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiFlowManager"
    }

    @ReactMethod
    fun registerStepHandoff() {
        //NamiFlowManager.registerStepHandoff { handoffTag, handoffData ->
        //    val payload = Arguments.createMap().apply {
        //        putString("handoffTag", handoffTag)
        //        putString("handoffData", handoffData)
        //    }
        //
        //    sendEvent("RegisterStepHandoff", payload)
        //}
    }

    @ReactMethod
    fun resume() {
        //NamiFlowManager.resume()
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
