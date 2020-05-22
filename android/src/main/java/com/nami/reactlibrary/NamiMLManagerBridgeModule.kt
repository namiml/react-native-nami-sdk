package com.nami.reactlibrary


import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.namiml.ml.NamiMLManager


class NamiMLManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {

    }

    override fun getName(): String {
        return "NamiMLManagerBridge"
    }

    @ReactMethod
    fun enterCoreContentWithLabels(labels: ReadableArray) {
        // Major Kotlin Evil Alert
        val convertedLabels: List<String>? = (labels.toArrayList() as? Array<*>)?.filterIsInstance<String>()
        convertedLabels?.let {
            NamiMLManager.enterCoreContent(it)
        }
    }

    @ReactMethod
    fun enterCoreContentWithLabel(label: String) {
        val coreContentLabels = ArrayList<String>()
        coreContentLabels.add(label)
        NamiMLManager.enterCoreContent(coreContentLabels)
    }


    @ReactMethod
    fun exitCoreContentWithLabels(labels: ReadableArray) {
        // Major Kotlin Evil Alert
        val convertedLabels: List<String>? = (labels.toArrayList() as? Array<*>)?.filterIsInstance<String>()
        convertedLabels?.let {
            NamiMLManager.exitCoreContent(it)
        }
    }

    @ReactMethod
    fun exitCoreContentWithLabel(label: String) {
        var coreContentLabels = ArrayList<String>()
        coreContentLabels.add(label)
        NamiMLManager.exitCoreContent(coreContentLabels)
    }

    @ReactMethod
    fun coreActionWithLabel(label: String) {
        var coreContentLabels = ArrayList<String>()
        coreContentLabels.add(label)
        NamiMLManager.coreAction(coreContentLabels)
    }

    @ReactMethod
    fun coreActionWithLabels(labels: ReadableArray) {
        // Major Kotlin Evil Alert
        val convertedLabels: List<String>? = (labels.toArrayList() as? Array<*>)?.filterIsInstance<String>()
        convertedLabels?.let {
            NamiMLManager.coreAction(convertedLabels)
        }
    }
}