package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.customer.CustomerJourneyState
import com.namiml.customer.NamiCustomerManager

class NamiCustomerManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiCustomerManagerBridge"
    }

    init {
        NamiCustomerManager.registerCustomerJourneyChangedListener { customerJourneyState ->
            emitCustomerJourneyChanged(customerJourneyState)
        }
    }

    private fun emitCustomerJourneyChanged(customerJourneyState: CustomerJourneyState) {
        Log.i(LOG_TAG, "Emitting CustomerJourneyState changed")
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("CustomerJourneyStateChanged", customerJourneyState.toDict())
        } catch (e: Exception) {
            Log.e(LOG_TAG, "Caught Exception: " + e.message)
        }
    }

    @ReactMethod
    fun currentCustomerJourneyState(resultsCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
            resultsCallback.invoke(NamiCustomerManager.currentCustomerJourneyState().toDict())
        }
    }
}