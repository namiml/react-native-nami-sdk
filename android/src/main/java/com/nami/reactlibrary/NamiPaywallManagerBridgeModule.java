package com.nami.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;


import com.namiml.BuildConfig;
import com.namiml.Nami;
import com.namiml.NamiConfiguration;
import com.namiml.NamiLogLevel;

public class NamiPaywallManagerBridgeModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public NamiPaywallManagerBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "NamiPaywallManagerBridge";
    }
}
