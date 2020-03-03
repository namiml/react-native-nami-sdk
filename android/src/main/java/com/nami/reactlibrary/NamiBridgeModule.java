package com.nami.reactlibrary;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;


import com.namiml.BuildConfig;
import com.namiml.Nami;
import com.namiml.NamiConfiguration;
import com.namiml.NamiLogLevel;

import org.jetbrains.annotations.NotNull;

public class NamiBridgeModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    NamiBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NotNull
    @Override
    public String getName() {
        return "NamiBridge";
    }

    @ReactMethod
    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
        // TODO: Implement some actually useful functionality
        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
    }

    @ReactMethod
    public void configureWithAppID(String appID) {
        Log.e("ReactNative", "Nami Configure called with appID " + appID);
        Log.e("ReactNative", "Nami Configure called with context " + reactContext);
        Log.e("ReactNative", "Nami Configure called with context.applicationContext " + reactContext.getApplicationContext());

        Context appContext = reactContext.getApplicationContext();
        boolean fred = (appContext instanceof Application);
        Log.e("ReactNative", "Nami Configure called with (context as Application) ");
        System.out.println(fred);
        Log.e("ReactNative", "Nami end Application check ");

        //Application fred = (reactContext as Application);

        NamiConfiguration.Builder builder = new NamiConfiguration.Builder(appContext, appID);
        if (BuildConfig.DEBUG) {
            builder.logLevel(NamiLogLevel.DEBUG);
        }
        NamiConfiguration builtConfig = builder.build();
        Log.e("ReactNative", "Nami Configuration object is " + builtConfig.toString());

        Nami.configure(builtConfig);
    }
}
