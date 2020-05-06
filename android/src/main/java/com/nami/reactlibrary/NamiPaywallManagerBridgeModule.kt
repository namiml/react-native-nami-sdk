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

        val activity: Activity? = currentActivity
        Log.i("NamiBridge", "Nami Activity to raise paywall is " + activity.toString());

        if (NamiPaywallManager.canRaisePaywall()) {
            Log.d("NamiBridge", "About to raise Paywall ");
            if (activity != null) {
                Log.i("NamiBridge", "Raising Paywall: ");
                NamiPaywallManager.raisePaywall(activity)
            } else {
                Log.w("NamiBridge", "Activity from react getCurrentActivity was null.");
            }
        } else {
            Log.w("NamiBridge", "Paywall not raised, SDK says paywall cannot be raised at this time.");
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
