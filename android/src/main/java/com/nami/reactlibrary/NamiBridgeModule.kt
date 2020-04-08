package com.nami.reactlibrary

import android.app.Application
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLogLevel

class NamiBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    override fun getName(): String {
        return "NamiBridge"
    }

//    @ReactMethod
//    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
//        // TODO: Implement some actually useful functionality
//        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
//    }

    @ReactMethod
    fun configure(configDict: ReadableMap) {

        // Need to be sure we have some valid string.
        val appPlatformID: String = if (configDict.hasKey("appPlatformID")) configDict.getString("appPlatformID") ?: "APPPLATFORMID_NOT_FOUND" else "APPPLATFORMID_NOT_FOUND"

        val reactContext = reactApplicationContext
        Log.e("ReactNative", "Nami Configure called with appID " + appPlatformID)
        Log.e("ReactNative", "Nami Configure called with context " + reactContext)
        Log.e("ReactNative", "Nami Configure called with context.applicationContext " + reactContext.getApplicationContext())

        val appContext: Context = reactContext.getApplicationContext()
        val isApplication: Boolean = (appContext is Application)
        Log.e("ReactNative", "Nami Configure called with (context as Application) " + isApplication + ".")
        Log.e("ReactNative", "Nami end Application check ");

        //Application fred = (reactContext as Application);


        val builder: NamiConfiguration.Builder = NamiConfiguration.Builder(appContext, appPlatformID)

        // React native will crash if you request a key from a map that does not exist, so always check key first
        val logLevelString = if (configDict.hasKey("logLevel")) configDict.getString("logLevel") else ""
        if (logLevelString == "DEBUG") {
            // Will have to figure out how to get this from a react app later... may include that in the call.
            builder.logLevel(NamiLogLevel.DEBUG)
        } else if (logLevelString == "ERROR") {
            builder.logLevel(NamiLogLevel.ERROR)
        }


        val developmentMode = if (configDict.hasKey("developmentMode")) configDict.getBoolean("developmentMode") else false
        if (developmentMode) {
            builder.developmentMode = true
        }

        val builtConfig: NamiConfiguration = builder.build()
        Log.e("ReactNative", "Nami Configuration object is $builtConfig");

        Nami.configure(builtConfig)
    }
}
