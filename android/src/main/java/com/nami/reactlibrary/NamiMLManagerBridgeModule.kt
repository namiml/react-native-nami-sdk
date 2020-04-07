package com.nami.reactlibrary

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.util.Log

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback


import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.namiml.BuildConfig
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLogLevel
import com.namiml.NamiPaywallManager
import com.namiml.api.model.NamiPaywall

import org.jetbrains.annotations.NotNull

import java.util.ArrayList


public class NamiMLManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {

    }

    public override fun getName(): String {
        return "NamiMLManagerBridge"
    }

    @ReactMethod
    public fun enterCoreContentWithLabel(label: String ) {
    }

    @ReactMethod
    public fun exitCoreContentWithLabel(label: String ) {
    }

    @ReactMethod
    public fun coreActionWithLabel(label: String ) {
    }
}