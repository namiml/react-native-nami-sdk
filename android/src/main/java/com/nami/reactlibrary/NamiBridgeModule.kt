package com.nami.reactlibrary;

import android.app.Application;
import android.content.Context;
import android.util.Log;
import com.facebook.react.bridge.*


import com.namiml.BuildConfig;
import com.namiml.Nami;
import com.namiml.NamiConfiguration;
import com.namiml.NamiLogLevel;

import org.jetbrains.annotations.NotNull;

public class NamiBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    public override fun getName(): String {
        return "NamiBridge"
    }

//    @ReactMethod
//    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
//        // TODO: Implement some actually useful functionality
//        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
//    }

    @ReactMethod
    public fun configure( configDict: ReadableMap ) {
        val appPlatformID: String = configDict.getString("appPlatformID") ?: "APPPLATFORMID_NOT_FOUND"

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

        val logLevelString = configDict.getString("logLevel")
        if (logLevelString == "DEBUG") {
            // Will have to figure out how to get this from a react app later... may include that in the call.
            builder.logLevel(NamiLogLevel.DEBUG)
        } else if (logLevelString == "ERROR") {
            builder.logLevel(NamiLogLevel.ERROR)
        }

        val developmentMode = configDict.getBoolean("developmentMode")
        if (developmentMode) {
            builder.developmentMode = true
        }

        val builtConfig: NamiConfiguration = builder.build()
        Log.e("ReactNative", "Nami Configuration object is $builtConfig");

        Nami.configure(builtConfig)
    }
}
