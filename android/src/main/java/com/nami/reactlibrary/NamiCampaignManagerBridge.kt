package com.nami.reactlibrary

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.campaign.NamiCampaign
import com.namiml.campaign.NamiCampaignManager
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.model.NamiPaywallAction
import android.app.Activity

class NamiCampaignManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    override fun getName(): String {
        return "RNNamiCampaignManager"
    }

    private fun campaignToReadableMap(campaign: NamiCampaign): ReadableMap {
        val readableMap = Arguments.createMap()
        readableMap.putString("segment", campaign.segment)
        readableMap.putString("paywall", campaign.paywall)
        readableMap.putString("value", campaign.value)
        readableMap.putString("type", campaign.type.toString().lowercase())
        return readableMap
    }

    @ReactMethod
    fun launch(label: String?, callback: Callback) {
        Log.d(LOG_TAG, "label")
        if (label != null) {
            Log.d(LOG_TAG, label)
        }
        val intent = Intent(currentActivity, PaywallActivity::class.java)
        currentActivity!!.startActivity(intent)

        val paywallActionCallback: (NamiPaywallAction, NamiSKU?) -> Unit = { action, sku ->

        }

        reactApplicationContext.runOnUiQueueThread {
            if (label != null) {
                NamiCampaignManager.launch(currentActivity!!, label, paywallActionCallback) { result -> {

                }}
            } else {
                NamiCampaignManager.launch(currentActivity!!)
            }
        }
    }

    override fun onActivityResult(
            activity: Activity?,
            requestCode: Int,
            resultCode: Int,
            intent: Intent?
    ) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

    @ReactMethod
    fun allCampaigns(promise: Promise){
        val campaigns = NamiCampaignManager.allCampaigns()
        val array = WritableNativeArray()
        campaigns.forEach { campaign ->
            array.pushMap(campaignToReadableMap(campaign))
        }
        promise.resolve(array)
    }

    @ReactMethod
    fun isCampaignAvailable(label: String?, promise: Promise){
        val isCampaignAvailable: Boolean
        if (label != null) {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(label)
        } else {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable()
        }
        promise.resolve(isCampaignAvailable)
    }

    @ReactMethod
    fun refresh(){
        NamiCampaignManager.refresh() {  }
    }

    @ReactMethod
    fun registerAvailableCampaignsHandler() {
        NamiCampaignManager.registerAvailableCampaignsHandler { availableCampaigns ->
            val array = WritableNativeArray()
            availableCampaigns.forEach { campaign ->
                array.pushMap(campaignToReadableMap(campaign))
            }
            reactApplicationContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("AvailableCampaignsChanged", array)
        }
    }
}
