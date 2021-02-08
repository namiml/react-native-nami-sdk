package com.nami.reactlibrary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.namiml.ml.NamiMLManager

class NamiMLManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiMLManagerBridge"
    }

    @ReactMethod
    fun enterCoreContentWithLabels(labels: ReadableArray) {
        NamiMLManager.enterCoreContent(labels.toArrayList().filterIsInstance<String>())
    }

    @ReactMethod
    fun enterCoreContentWithLabel(label: String) {
        NamiMLManager.enterCoreContent(label)
    }
    
    @ReactMethod
    fun exitCoreContentWithLabels(labels: ReadableArray) {
        NamiMLManager.exitCoreContent(labels.toArrayList().filterIsInstance<String>())
    }

    @ReactMethod
    fun exitCoreContentWithLabel(label: String) {
        NamiMLManager.exitCoreContent(label)
    }

    @ReactMethod
    fun coreActionWithLabel(label: String) {
        NamiMLManager.coreAction(label)
    }
}