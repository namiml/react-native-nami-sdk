package com.nami.reactlibrary;

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;


import com.namiml.BuildConfig;
import com.namiml.Nami;
import com.namiml.NamiConfiguration;
import com.namiml.NamiLogLevel;
import com.namiml.NamiPaywallManager;

import org.jetbrains.annotations.NotNull;



public class NamiPaywallManagerBridgeModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public NamiPaywallManagerBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NotNull
    @Override
    public String getName() {
        return "NamiPaywallManagerBridge";
    }

    @ReactMethod
    public void raisePaywall() {
//        [[NamiPaywallManager shared] raisePaywallFromVC:nil];
        if (NamiPaywallManager.canRaisePaywall()) {
            Activity activity = getActivity(reactContext);
            if (activity != null) {
                NamiPaywallManager.raisePaywall(activity, false);
                Log.e("ReactNative", "Raising Paywall: ");
            }
        } else {
            Log.e("ReactNative", "Paywall not raised, SDK says paywall cannot be raised at this time. ");
        }
    }


    public Activity getActivity(Context context)
    {
        if (context == null)
        {
            Log.e("ReactNative", "Context was null, no activity found. ");
            return null;
        }
        else if (context instanceof ContextWrapper)
        {
            if (context instanceof Activity)
            {
                return (Activity) context;
            }
            else
            {
                return getActivity(((ContextWrapper) context).getBaseContext());
            }
        }

        Log.e("ReactNative", "No activity found in context. ");
        return null;
    }
}
