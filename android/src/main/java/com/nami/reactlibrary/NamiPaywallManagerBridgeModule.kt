package com.nami.reactlibrary


import android.app.Activity
import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.paywall.NamiPaywallManager


class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var blockRaisePaywall: Boolean = false

    fun NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext?) {
        NamiPaywallManager.registerApplicationAutoRaisePaywallBlocker {
            Log.i("NamiBridge", "Nami flag for blocking paywall raise is " + blockRaisePaywall.toString());
            blockRaisePaywall
        }
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

    @ReactMethod
    fun blockRaisePaywall(blockRaise: Boolean) {
        blockRaisePaywall = blockRaise
    }


    @ReactMethod
    fun presentNamiPaywall(skuIDs: ReadableArray, metapaywallDefinition:ReadableMap) {
        // TODO: Android SDK needs presentNamiPaywall function.
    }

    @ReactMethod
    fun fetchCustomMetadataForDeveloperID(paywallDeveloperID: String, successCallback: Callback) {
        val sendDict = WritableNativeMap()
        //TODO: Android SDK needs fetchCustomMetadataForDeveloperID
        successCallback(sendDict)
    }

    @ReactMethod
    fun paywallImpression(developerPaywallID: String) {
        // TODO: Android SDK paywall impression call.
    }

}
