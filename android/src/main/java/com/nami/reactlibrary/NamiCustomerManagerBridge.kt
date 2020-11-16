package com.nami.reactlibrary


import com.facebook.react.bridge.*
import com.namiml.customer.NamiCustomerManager

class NamiCustomerManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiCustomerManagerBridge"
    }

    @ReactMethod
    fun currentCustomerJourneyState(resultsCallback: Callback) {
        val journeyState = NamiCustomerManager.currentCustomerJourneyState()

        val formerSubscriber = journeyState?.formerSubscriber ?: false
        val inGracePeriod = journeyState?.inGracePeriod ?: false
        val inTrialPeriod = journeyState?.inTrialPeriod ?: false
        val inIntroOfferPeriod = journeyState?.inIntroOfferPeriod ?: false

        val journeyDict = WritableNativeMap().apply {
            putBoolean("formerSubscriber", formerSubscriber)
            putBoolean("inGracePeriod", inGracePeriod)
            putBoolean("inTrialPeriod", inTrialPeriod)
            putBoolean("inIntroOfferPeriod", inIntroOfferPeriod)
        }

        resultsCallback.invoke(journeyDict)
    }
}