package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.ml.NamiMLManager


class NamiMLManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiMLManagerBridge"
    }

    private fun convertToArrayList(readableArray: ReadableArray): List<String>? {

        val finalArray = mutableListOf<String>()
        for (i in 0..readableArray.size()) {
            if (readableArray.getType(i) == ReadableType.String) {
                readableArray.getString(i)?.let { item ->
                    finalArray.add(item)
                }
            }
        }
        if (finalArray.size > 0) {
            return finalArray
        } else {
            return null
        }
    }

    @ReactMethod
    fun enterCoreContentWithLabels(labels: ReadableArray) {
        // Major Kotlin Evil Alert
        val convertedLabels: List<String>? = convertToArrayList(labels)
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

        val convertedLabels: List<String>? = convertToArrayList(labels)
        convertedLabels?.let {
            NamiMLManager.exitCoreContent(it)
        }
    }

    @ReactMethod
    fun exitCoreContentWithLabel(label: String) {
        val coreContentLabels = ArrayList<String>()
        coreContentLabels.add(label)
        NamiMLManager.exitCoreContent(coreContentLabels)
    }

    @ReactMethod
    fun coreActionWithLabel(label: String) {
        val coreContentLabels = ArrayList<String>()
        coreContentLabels.add(label)
        NamiMLManager.coreAction(coreContentLabels)
    }

    @ReactMethod
    fun coreActionWithLabels(labels: ReadableArray) {
        // Major Kotlin Evil Alert
        val convertedLabels: List<String>? = convertToArrayList(labels)
        convertedLabels?.let {
            NamiMLManager.coreAction(convertedLabels)
        }
    }
}