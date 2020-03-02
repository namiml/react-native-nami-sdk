package com.nami.reactlibrary;

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
        NamiConfiguration.Builder builder = new NamiConfiguration.Builder(reactContext, appID);
        if (BuildConfig.DEBUG) {
            builder.logLevel(NamiLogLevel.DEBUG);
        }
        Nami.configure(builder.build());
    }
}
