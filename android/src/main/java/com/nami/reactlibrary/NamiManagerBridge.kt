package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.Nami

class NamiManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiManager"
    }

    @ReactMethod
    fun sdkConfigured(promise: Promise) {
        val sdkConfigured = Nami.isInitialized()
        promise.resolve(sdkConfigured)
    }

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }
}
