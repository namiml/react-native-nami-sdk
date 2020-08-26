package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.entitlement.NamiEntitlement
import com.namiml.paywall.NamiPaywallManager

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var blockRaisePaywall: Boolean = false

    init {
        NamiPaywallManager.registerApplicationAutoRaisePaywallBlocker {
            Log.i("NamiBridge", "Nami flag for blocking paywall raise is $blockRaisePaywall");
            blockRaisePaywall
        }
        reactContext.addActivityEventListener(this);
    }

    override fun getName(): String {
        return "NamiPaywallManagerBridge"
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        Log.d("NamiBridge", "Nami Activity result listener activated, code is $requestCode")
        if (NamiPaywallManager.didUserCloseBlockingNamiPaywall(requestCode, resultCode)) {
            Log.i("NamiBridge", "User closed blocking paywall, sending event.  " +
                    "Activity was." + activity.toString())
            emitBockedPaywallClosed()
        }
    }

    fun emitBockedPaywallClosed() {
        val map = Arguments.createMap()
        map.putBoolean("blockingPaywallClosed", true)
        try {
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("BlockingPaywallClosed", map)
        } catch (e: Exception) {
            Log.e("NamiBridge", "Caught Exception: " + e.message)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

    @ReactMethod
    fun raisePaywall() {
//        [[NamiPaywallManager shared] raisePaywallFromVC:nil]

        val activity: Activity? = currentActivity
        Log.i("NamiBridge", "Nami Activity to raise paywall is " + activity.toString())

        if (NamiPaywallManager.canRaisePaywall()) {
            Log.d("NamiBridge", "About to raise Paywall ")
            if (activity != null) {
                Log.i("NamiBridge", "Raising Paywall: ")
                NamiPaywallManager.raisePaywall(activity)
            } else {
                Log.w("NamiBridge", "Activity from react getCurrentActivity was null.")
            }
        } else {
            Log.w("NamiBridge", "Paywall not raised, SDK says paywall cannot be raised at this time.")
        }
    }

    @ReactMethod
    fun canRaisePaywall(successCallback: Callback) {
//        BOOL canRaise = [[NamiPaywallManager shared] canRaisePaywall];
//        completion(@[[NSNumber numberWithBool:canRaise]]);


        val canRaiseResult: WritableArray = WritableNativeArray()
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
