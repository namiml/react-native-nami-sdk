package com.nami.reactlibrary

import android.util.Log
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.campaign.NamiCampaign
import com.namiml.campaign.NamiCampaignManager
import org.json.JSONObject

class NamiCampaignManagerBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNamiCampaignManager"
    }

    private fun campaignToJsonObject(campaign: NamiCampaign): JSONObject {
        val jsonObject = JSONObject()
//        jsonObject.put("id", campaign.id)
//        jsonObject.put("rule", campaign.rule)
        jsonObject.put("segment", campaign.segment)
        jsonObject.put("paywall", campaign.paywall)
//        jsonObject.put("type", campaign.type.rawValue)
        jsonObject.put("value", campaign.value)
        return jsonObject
    }

    @ReactMethod
    fun launch(label: String?, callback: (Boolean, Int?) -> Void) {
        if (label != null) {
            NamiCampaignManager.launch(currentActivity!!, label!!)
        } else {
            NamiCampaignManager.launch(currentActivity!!)
        }
    }

    @ReactMethod
    fun allCampaigns(promise: Promise){
        val campaigns = NamiCampaignManager.allCampaigns()
        val jsonArray = campaigns.map { campaign -> campaignToJsonObject(campaign) }
        promise.resolve(jsonArray)
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
       
    }
}
