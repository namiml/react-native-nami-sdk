package com.nami.reactlibrary;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Callback;


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
    public fun configure( configDict: Map<String,String> ) {
        val reactContext = reactApplicationContext
        Log.e("ReactNative", "Nami Configure called with appID " + appID)
        Log.e("ReactNative", "Nami Configure called with context " + reactContext)
        Log.e("ReactNative", "Nami Configure called with context.applicationContext " + reactContext.getApplicationContext())

        val appContext: Context = reactContext.getApplicationContext()
        val isApplication: Boolean = (appContext is Application)
        Log.e("ReactNative", "Nami Configure called with (context as Application) " + isApplication + ".")
        Log.e("ReactNative", "Nami end Application check ");

        //Application fred = (reactContext as Application);

        val appPlatformID: String = configDict["appPlatformID"] ?: "APPPLATFORMID_NOT_FOUND"

        val builder: NamiConfiguration.Builder = NamiConfiguration.Builder(appContext, appPlatformID)

        val logLevelString = configDict["logLevel"]
        if (logLevelString == "DEBUG") {
            // Will have to figure out how to get this from a react app later... may include that in the call.
            builder.logLevel(NamiLogLevel.DEBUG)
        } else if (logLevelString == "ERROR") {
            builder.logLevel(NamiLogLevel.ERROR)
        }

        var builtConfig: NamiConfiguration = builder.build()
        Log.e("ReactNative", "Nami Configuration object is " + builtConfig.toString());

        Nami.configure(builtConfig)
    }
}
