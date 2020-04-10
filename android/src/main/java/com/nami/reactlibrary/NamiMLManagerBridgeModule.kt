package com.nami.reactlibrary


import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class NamiMLManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {

    }

    override fun getName(): String {
        return "NamiMLManagerBridge"
    }

    @ReactMethod
    fun enterCoreContentWithLabel(label: String) {
    }

    @ReactMethod
    fun exitCoreContentWithLabel(label: String) {
    }

    @ReactMethod
    fun coreActionWithLabel(label: String) {
    }
}