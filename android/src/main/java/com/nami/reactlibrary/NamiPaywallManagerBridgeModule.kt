package com.nami.reactlibrary;

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

import java.util.ArrayList;


public class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {



    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {

    }

    @Override
    public fun getName(): String  {
        return "NamiPaywallManagerBridge"
    }

    @ReactMethod
    public fun raisePaywall() {
//        [[NamiPaywallManager shared] raisePaywallFromVC:nil];

        var activity: Activity? = currentActivity
        Log.e("ReactNative", "Nami Activity to raise paywall is " + activity.toString());

        if (NamiPaywallManager.canRaisePaywall()) {
            Log.e("ReactNative", "NAMI - About to raise Paywall ");
            if (activity != null) {
                Log.e("ReactNative", "Raising Paywall: ");
                NamiPaywallManager.raisePaywall(activity, false);
            } else {
                Log.e("ReactNative", "Activity from react getCurrentActivity was null. ");
            }
        } else {
            Log.e("ReactNative", "Paywall not raised, SDK says paywall cannot be raised at this time. ");
        }
    }

    @ReactMethod
    public fun canRaisePaywall( successCallback: Callback ) {
//        BOOL canRaise = [[NamiPaywallManager shared] canRaisePaywall];
//        completion(@[[NSNumber numberWithBool:canRaise]]);


        var canRaiseResult : WritableArray = WritableNativeArray()
        canRaiseResult.pushBoolean(NamiPaywallManager.canRaisePaywall())

        successCallback.invoke(canRaiseResult)
    }

}
