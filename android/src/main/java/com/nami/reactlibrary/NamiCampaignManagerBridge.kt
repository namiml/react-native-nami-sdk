package com.nami.reactlibrary

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.campaign.NamiCampaign
import com.namiml.campaign.NamiCampaignManager
import org.json.JSONObject

class NamiCampaignManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

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
    fun launch(label: String?, callback: (Boolean, Int?) -> Void) {
        Log.d(LOG_TAG, "label")

        reactApplicationContext.runOnUiQueueThread {
            if (label != null) {
                NamiCampaignManager.launch(reactApplicationContext.currentActivity!!, label!!)
            } else {
                NamiCampaignManager.launch(reactApplicationContext.currentActivity!!)
            }
        }
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
