package com.nami.reactlibrary


import android.app.Activity
import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.NamiPaywallManager


class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {

    }

    override fun getName(): String {
        return "NamiPaywallManagerBridge"
    }

    @ReactMethod
    fun raisePaywall() {
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
    fun canRaisePaywall(successCallback: Callback) {
//        BOOL canRaise = [[NamiPaywallManager shared] canRaisePaywall];
//        completion(@[[NSNumber numberWithBool:canRaise]]);


        var canRaiseResult: WritableArray = WritableNativeArray()
        canRaiseResult.pushBoolean(NamiPaywallManager.canRaisePaywall())

        successCallback.invoke(canRaiseResult)
    }

}
