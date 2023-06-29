package com.nami.reactlibrary

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.customer.CustomerJourneyState
import com.namiml.customer.NamiCustomerManager

class NamiCustomerManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiCustomerManager"
    }

    private fun journeyStateToReadableMap(journeyState: CustomerJourneyState): ReadableMap {
        val readableMap = Arguments.createMap()
        readableMap.putBoolean("formerSubscriber", journeyState.formerSubscriber)
        readableMap.putBoolean("inGracePeriodl", journeyState.inGracePeriod)
        readableMap.putBoolean("inTrialPeriod", journeyState.inTrialPeriod)
        readableMap.putBoolean("inIntroOfferPeriod", journeyState.inIntroOfferPeriod)
        readableMap.putBoolean("isCancelled", journeyState.isCancelled)
        readableMap.putBoolean("inPause", journeyState.inPause)
        readableMap.putBoolean("inAccountHold", journeyState.inAccountHold)
        return readableMap
    }

    @ReactMethod
    fun setCustomerAttribute(key: String, value: String) {
        NamiCustomerManager.setCustomerAttribute(key, value)
    }

    @ReactMethod
    fun getCustomerAttribute(key: String, promise: Promise) {
        val customerAttribute = NamiCustomerManager.getCustomerAttribute(key)
        promise.resolve(customerAttribute)
    }

    @ReactMethod
    fun clearCustomerAttribute(key: String) {
        NamiCustomerManager.clearCustomerAttribute(key)
    }

    @ReactMethod
    fun clearAllCustomerAttributes() {
        NamiCustomerManager.clearAllCustomerAttributes()
    }

    @ReactMethod
    fun clearCustomerDataPlatformId() {
        NamiCustomerManager.clearCustomerDataPlatformId()
    }

    @ReactMethod
    fun setCustomerDataPlatformId(cdpId: String) {
        NamiCustomerManager.setCustomerDataPlatformId(cdpId)
    }

    @ReactMethod
    fun setAnonymousMode(anonymousMode: Boolean) {
        NamiCustomerManager.setAnonymousMode(anonymousMode)
    }

    @ReactMethod
    fun inAnonymousMode(promise: Promise) {
        val anonymousMode = NamiCustomerManager.inAnonymousMode()
        promise.resolve(anonymousMode)
    }

    @ReactMethod
    fun journeyState(promise: Promise) {
        val journeyState = NamiCustomerManager.journeyState()
        if (journeyState == null) {
            promise.resolve(null)
        } else {
            val handledJourneyState = journeyStateToReadableMap(journeyState)
            promise.resolve(handledJourneyState)
        }
    }

    @ReactMethod
    fun isLoggedIn(promise: Promise) {
        val isLoggedIn = NamiCustomerManager.isLoggedIn()
        promise.resolve(isLoggedIn)
    }

    @ReactMethod
    fun loggedInId(promise: Promise) {
        val id = NamiCustomerManager.loggedInId()
        promise.resolve(id)
    }

    @ReactMethod
    fun deviceId(promise: Promise) {
        val id = NamiCustomerManager.deviceId()
        promise.resolve(id)
    }

    @ReactMethod
    fun login(customerId: String) {
        NamiCustomerManager.login(customerId)
    }

    @ReactMethod
    fun logout() {
        NamiCustomerManager.logout()
    }

    @ReactMethod
    fun registerJourneyStateHandler() {
        NamiCustomerManager.registerJourneyStateHandler { journeyState ->
            val handledJourneyState = journeyStateToReadableMap(journeyState)
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("JourneyStateChanged", handledJourneyState)
        }
    }

    @ReactMethod
    fun registerAccountStateHandler() {
        NamiCustomerManager.registerAccountStateHandler { action, success, error ->
            val body = Arguments.createMap()
            body.putString("action", action.toString())
            body.putBoolean("success", success)
            body.putString("error", error.toString())
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("AccountStateChanged", body)
        }
    }

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }
}
