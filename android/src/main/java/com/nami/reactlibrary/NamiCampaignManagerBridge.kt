package com.nami.reactlibrary

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.campaign.LaunchCampaignResult
import com.namiml.campaign.NamiCampaign
import com.namiml.campaign.NamiCampaignManager
import com.namiml.paywall.NamiSKU
import com.namiml.paywall.model.NamiPaywallAction
import com.namiml.paywall.model.PaywallLaunchContext

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
    fun launch(label: String?, context: ReadableMap?, resultCallback: Callback, actionCallback: Callback) {
        var theActivity: Activity? = null
        if (reactApplicationContext.hasCurrentActivity()) {
            theActivity = reactApplicationContext.getCurrentActivity()
        }

        var paywallLaunchContext: PaywallLaunchContext? = null
        if (context != null) {

            val productGroups: MutableList<String> = mutableListOf()
            val customAttributes: MutableMap<String, String> = mutableMapOf()

            if (context.hasKey("productGroups")) {
                val groups = context.getArray("productGroups")
                if (groups != null) {
                    for (i in 0 until groups.size()) {
                        val groupString = groups.getString(i)
                        if (groupString != null) {
                            productGroups.add(groupString)
                        }

                    }
                }
                Log.d(LOG_TAG, "productGroups $productGroups")
            }

            if (context.hasKey("customAttributes")) {
                val attr = context.getMap("customAttributes")
                if (attr != null) {
                    val keyIterator = attr.keySetIterator()
                    while (keyIterator.hasNextKey()) {
                        val key = keyIterator.nextKey()
                        customAttributes[key] = attr.getString(key) ?: ""
                    }
                    Log.d(LOG_TAG, "customAttributes $customAttributes")
                }
            }

            paywallLaunchContext = PaywallLaunchContext(productGroups.toList(), customAttributes)
        }

        if (theActivity != null) {
            reactApplicationContext.runOnUiQueueThread {
                if (label != null) {
                    NamiCampaignManager.launch(
                        theActivity,
                        label,
                        paywallActionCallback = { campaignId, campaignLabel, paywallId, action, sku, purchaseError, purchases ->
                            handlePaywallCallback(campaignId, campaignLabel, paywallId, action, sku, purchaseError, purchases, actionCallback)
                        },
                        paywallLaunchContext,
                    ) { result -> handleResult(result, resultCallback) }
                } else {
                    NamiCampaignManager.launch(
                        theActivity,
                        paywallActionCallback = { campaignId, campaignLabel, paywallId, action, sku, purchaseError, purchases ->
                            handlePaywallCallback(campaignId, campaignLabel, paywallId, action, sku, purchaseError, purchases, actionCallback)
                        },
                    ) { result -> handleResult(result, resultCallback) }
                }
            }
        }

    }

    private fun handlePaywallCallback(campaignId: String, campaignLabel: String?, paywallId: String, action: NamiPaywallAction, sku: NamiSKU?, purchaseError: String?, purchases: List<NamiPurchase>?, actionCallback: Callback) {
        val actionString = action.toString()
        val skuString = sku?.skuId.orEmpty()
        val purchasesArray: WritableArray = WritableNativeArray()
        if (purchases != null) {
            for (purchase in purchases) {
                purchasesArray.pushMap(purchase.toPurchaseDict())
            }
        }
        val resultMap = Arguments.createMap()
        resultMap.putString("campaignId", campaignId)
        resultMap.putString("campaignLabel", campaignLabel)
        resultMap.putString("paywallId", paywallId)
        resultMap.putString("action", actionString)
        resultMap.putString("skuId", skuString)
        resultMap.putString("purchaseError", purchaseError)
        resultMap.putArray("purchases", purchasesArray)
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("ResultCampaign", resultMap)
    }

    private fun handleResult(result: LaunchCampaignResult, resultCallback: Callback) {
        val resultMap = Arguments.createMap()
        when (result) {
            is LaunchCampaignResult.Success -> {
                resultCallback.invoke(true)
            }
            is LaunchCampaignResult.Failure -> {
                resultCallback.invoke(false, "${result.error}")
            }
        }
    }

    override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?,
    ) {
        Log.d(LOG_TAG, "Nami Activity result listener activated, code is $requestCode")
    }

    override fun onNewIntent(intent: Intent?) {
        // do nothing
    }

    @ReactMethod
    fun allCampaigns(promise: Promise) {
        val campaigns = NamiCampaignManager.allCampaigns()
        val array = WritableNativeArray()
        campaigns.forEach { campaign ->
            array.pushMap(campaignToReadableMap(campaign))
        }
        promise.resolve(array)
    }

    @ReactMethod
    fun isCampaignAvailable(label: String?, promise: Promise) {
        val isCampaignAvailable: Boolean
        if (label != null) {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(label)
        } else {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable()
        }
        promise.resolve(isCampaignAvailable)
    }

    @ReactMethod
    fun refresh() {
        NamiCampaignManager.refresh() { }
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

    @ReactMethod
    fun addListener(eventName: String?) {
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
    }
}
