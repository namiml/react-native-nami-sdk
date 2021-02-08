package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.paywall.NamiPaywallManager

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var blockRaisePaywall: Boolean = false

    init {
        NamiPaywallManager.registerApplicationAutoRaisePaywallBlocker {
            Log.i(LOG_TAG, "Nami flag for blocking paywall raise is $blockRaisePaywall");
            blockRaisePaywall
        }
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "NamiPaywallManagerBridge"
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
        if (NamiPaywallManager.didUserCloseBlockingNamiPaywall(requestCode, resultCode)) {
            Log.i(LOG_TAG, "User closed blocking paywall, sending event.  " +
                    "Activity was." + activity.toString())
            emitBockedPaywallClosed()
        }
    }

    fun emitBockedPaywallClosed() {
        val map = Arguments.createMap().apply {
            putBoolean("blockingPaywallClosed", true)
        }
        try {
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("BlockingPaywallClosed", map)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

    @ReactMethod
    fun raisePaywall() {
        raisePaywall(currentActivity, null)
    }

    @ReactMethod
    fun raisePaywallByDeveloperPaywallId(developerPaywallID: String) {
        raisePaywall(currentActivity, developerPaywallID)
    }

    private fun raisePaywall(activity: Activity?, developerPaywallID: String?) {
        if (NamiPaywallManager.canRaisePaywall()) {
            Log.d(LOG_TAG, "About to raise Paywall ")
            if (activity != null) {
                Log.i(LOG_TAG, "Nami Activity to raise paywall is $activity")
                if (developerPaywallID == null) {
                    Log.i(LOG_TAG, "Raising Paywall: ")
                    NamiPaywallManager.raisePaywall(activity)
                } else {
                    Log.i(LOG_TAG, "Raising Paywall by Id: $developerPaywallID")
                    NamiPaywallManager.raisePaywall(developerPaywallID, activity)
                }
            } else {
                Log.w(LOG_TAG, "Activity from react getCurrentActivity was null.")
            }
        } else {
            Log.w(LOG_TAG, "Paywall not raised, SDK says paywall cannot be raised at this time.")
        }
    }

    @ReactMethod
    fun canRaisePaywall(successCallback: Callback) {
//        BOOL canRaise = [[NamiPaywallManager shared] canRaisePaywall];
//        completion(@[[NSNumber numberWithBool:canRaise]]);

        val canRaiseResult = NamiPaywallManager.canRaisePaywall()

        successCallback.invoke(canRaiseResult)
    }

    @ReactMethod
    fun blockRaisePaywall(blockRaise: Boolean) {
        blockRaisePaywall = blockRaise
    }


    @ReactMethod
    fun presentNamiPaywall(skuIDs: ReadableArray, metapaywallDefinition: ReadableMap) {
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
