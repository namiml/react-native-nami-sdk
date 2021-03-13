package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.paywall.NamiPaywallManager

class NamiPaywallManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    private var blockRaisePaywall: Boolean = false

    init {
        NamiPaywallManager.registerApplicationAutoRaisePaywallBlocker {
            Log.i(LOG_TAG, "Nami flag for blocking paywall raise is $blockRaisePaywall")
            blockRaisePaywall
        }
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "NamiPaywallManagerBridge"
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
        if (NamiPaywallManager.didUserCloseBlockingNamiPaywall(requestCode, resultCode)) {
            Log.i(
                LOG_TAG, "User closed blocking paywall, sending event.  " +
                    "Activity was." + activity.toString()
            )
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
        reactApplicationContext.runOnUiQueueThread {
            raisePaywall(currentActivity, null)
        }
    }

    @ReactMethod
    fun raisePaywallByDeveloperPaywallId(developerPaywallID: String) {
        reactApplicationContext.runOnUiQueueThread {
            raisePaywall(currentActivity, developerPaywallID)
        }
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
        reactApplicationContext.runOnUiQueueThread {
            val canRaiseResult = NamiPaywallManager.canRaisePaywall()
            successCallback.invoke(canRaiseResult)
        }
    }

    @ReactMethod
    fun blockRaisePaywall(blockRaise: Boolean) {
        blockRaisePaywall = blockRaise
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


    @ReactMethod
    fun preparePaywallForDisplay(backgroundImageRequired: Boolean, imageFetchTimeout: Double) {
        val imageFetchTimeoutConvertedToLong: Long = imageFetchTimeout.toLong()
        reactApplicationContext.runOnUiQueueThread {
            NamiPaywallManager.preparePaywallForDisplay(backgroundImageRequired, imageFetchTimeoutConvertedToLong) { success, error ->
                emitPreparePaywallFinsihed(success, null, error)
            }
        }
    }


    @ReactMethod
    fun preparePaywallForDisplayByDeveloperPaywallId(developerPaywallID: String, backgroundImageRequired: Boolean, imageFetchTimeout: Double) {
        val imageFetchTimeoutConvertedToLong: Long = imageFetchTimeout.toLong()
        reactApplicationContext.runOnUiQueueThread {
            NamiPaywallManager.preparePaywallForDisplay(developerPaywallID, backgroundImageRequired, imageFetchTimeoutConvertedToLong) { success, error ->
                emitPreparePaywallFinsihed(success, developerPaywallID, error)
            }
        }
    }

    fun emitPreparePaywallFinished(success: Boolean, developerPaywallID:String?, error: com.namiml.paywall.PreparePaywallError?) {
        val prepareContentMap = Arguments.createMap()
        prepareContentMap.putBoolean("success", success)

        if ( developerPaywallID != null ) {
            prepareContentMap.putString("developerPaywallID", developerPaywallID)
        }

        if ( error != null ) {
            prepareContentMap.putInt("errorCode", error.ordinal)
            prepareContentMap.putString("errorMessage", error.toString())
        }

        Log.i(LOG_TAG, "Emitting preparePaywallForDisplay finished with result " + success + "error: " + error.toString())
        try {
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("PreparePaywallFinished", prepareContentMap)
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }
}
