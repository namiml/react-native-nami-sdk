package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.billing.NamiPurchaseState
import com.namiml.billing.NamiCustomerManager

class NamiCustomerManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiCustomerManagerBridge"
    }

    override fun initialize() {
    }

    @ReactMethod
    fun currentCustomerJourneyState(resultsCallback: Callback) {
        val journeyState = NamiCustomerManager.currentCustomerJourneyState()

        val formerSubscriber = journeyState.formerSubscriber ?: false
        val inGracePeriod = journeyState.inGracePeriod ?: false
        val inTrialPeriod = journeyState.inTrialPeriod ?: false
        val inIntroOfferPeriod = journeyState.inIntroOfferPeriod ?: false

        val journeyDict = WritableNativeMap()
        journeyDict.putBoolean("formerSubscriber", formerSubscriber)
        journeyDict.putBoolean("inGracePeriod", inGracePeriod)
        journeyDict.putBoolean("inTrialPeriod", inTrialPeriod)
        journeyDict.putBoolean("inIntroOfferPeriod", inIntroOfferPeriod)

        resultsCallback.invoke(journeyDict)
    }
}