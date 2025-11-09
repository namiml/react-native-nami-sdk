package com.namiml.reactnative

import android.app.Activity
import android.net.Uri
import android.util.Log
import androidx.core.net.toUri
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.namiml.billing.NamiPurchase
import com.namiml.campaign.LaunchCampaignError
import com.namiml.campaign.LaunchCampaignResult
import com.namiml.campaign.NamiCampaign
import com.namiml.campaign.NamiCampaignManager
import com.namiml.paywall.model.NamiPaywallEvent
import com.namiml.paywall.model.PaywallLaunchContext

@ReactModule(name = NamiCampaignManagerBridgeModule.NAME)
class NamiCampaignManagerBridgeModule internal constructor(
    private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext),
    TurboModule {
    companion object {
        const val NAME = "RNNamiCampaignManager"
        const val CAMPAIGN_ID = "campaignId"
        const val CAMPAIGN_LABEL = "campaignLabel"
        const val PAYWALL_ID = "paywallId"
        const val ACTION = "action"
        const val SKU = "sku"
        const val PURCHASE_ERROR = "purchaseError"
        const val PURCHASES = "purchases"
        const val CAMPAIGN_NAME = "campaignName"
        const val CAMPAIGN_TYPE = "campaignType"
        const val CAMPAIGN_URL = "campaignUrl"
        const val PAYWALL_NAME = "paywallName"
        const val COMPONENT_CHANGE = "componentChange"
        const val SEGMENT_ID = "segmentId"
        const val EXTERNAL_SEGMENT_ID = "externalSegmentId"
        const val DEEP_LINK_URL = "deeplinkUrl"
        const val TIME_SPENT_ON_PAYWALL = "timeSpentOnPaywall"
        const val VIDEO_METADATA = "videoMetadata"
        const val NAMI_PAYWALL_EVENT = "NamiPaywallEvent"
    }

    override fun getName(): String = NAME

    private fun campaignToReadableMap(campaign: NamiCampaign): ReadableMap {
        val readableMap = Arguments.createMap()
        readableMap.putString("segment", campaign.segment)
        readableMap.putString("paywall", campaign.paywall)
        readableMap.putString("value", campaign.value)
        readableMap.putString("type", campaign.type.toString().lowercase())
        return readableMap
    }

    @ReactMethod
    fun launch(
        label: String?,
        withUrl: String?,
        context: ReadableMap?,
        resultCallback: Callback,
        actionCallback: Callback,
    ) {
        var theActivity: Activity? = null
        if (reactApplicationContext.hasCurrentActivity()) {
            theActivity = reactApplicationContext.currentActivity
        }

        var paywallLaunchContext: PaywallLaunchContext? = null
        if (context != null) {
            val productGroups: MutableList<String> = mutableListOf()
            val customAttributes: MutableMap<String, Any> = mutableMapOf()
            var customObject: MutableMap<String, Any?> = mutableMapOf()

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
                Log.d(NAME, "productGroups $productGroups")
            }

            if (context.hasKey("customAttributes")) {
                val attr = context.getMap("customAttributes")
                if (attr != null) {
                    val keyIterator = attr.keySetIterator()
                    while (keyIterator.hasNextKey()) {
                        val key = keyIterator.nextKey()
                        try {
                            // Handle different data types and store with proper types
                            val value: Any =
                                when (attr.getType(key)) {
                                    ReadableType.String -> attr.getString(key) ?: ""
                                    ReadableType.Boolean -> attr.getBoolean(key)
                                    ReadableType.Number -> {
                                        // Try to get as int first, then as double
                                        try {
                                            attr.getInt(key)
                                        } catch (e: Exception) {
                                            attr.getDouble(key)
                                        }
                                    }
                                    ReadableType.Null -> ""
                                    ReadableType.Array -> attr.getArray(key)?.toArrayList() ?: emptyList<Any>()
                                    ReadableType.Map -> attr.getMap(key)?.toHashMap() ?: emptyMap<String, Any>()
                                }
                            customAttributes[key] = value
                        } catch (e: Exception) {
                            // Log the error and try to store the value as a string representation
                            Log.w(NAME, "Error parsing customAttribute '$key': ${e.message}. Attempting string conversion.")
                            try {
                                // Fallback: try to get the dynamic value and convert to string
                                val dynamicValue = attr.getDynamic(key)
                                customAttributes[key] = dynamicValue.asString() ?: ""
                            } catch (fallbackError: Exception) {
                                // If all else fails, log and skip this attribute
                                Log.e(NAME, "Failed to parse customAttribute '$key': ${fallbackError.message}. Skipping.")
                            }
                        }
                    }
                    Log.d(NAME, "customAttributes $customAttributes")
                }
            }

            if (context.hasKey("customObject")) {
                val attr = context.getMap("customObject")
                if (attr != null) {
                    try {
                        customObject = attr.toHashMap().toMutableMap()
                    } catch (e: Exception) {
                        Log.d(NAME, "Unable to parse PaywallLaunchContext customObject $customObject")
                    }
                }
            }

            if (context.hasKey("productGroups")) {
                paywallLaunchContext = PaywallLaunchContext(productGroups.toList(), customAttributes, customObject)
            } else {
                paywallLaunchContext = PaywallLaunchContext(null, customAttributes, customObject)
            }
        }

        if (theActivity != null) {
            reactApplicationContext.runOnUiQueueThread {
                val paywallActionCallback = { paywallEvent: NamiPaywallEvent ->
                    handlePaywallCallback(
                        paywallEvent,
                        actionCallback,
                    )
                }

                val uriObject: Uri? = if (withUrl != null) withUrl.toUri() else null

                if (label != null) {
                    NamiCampaignManager.launch(
                        theActivity,
                        label,
                        paywallActionCallback = paywallActionCallback,
                        paywallLaunchContext,
                    ) { result -> handleResult(result, resultCallback) }
                } else if (withUrl != null) {
                    NamiCampaignManager.launch(
                        theActivity,
                        paywallActionCallback = paywallActionCallback,
                        context = paywallLaunchContext,
                        uri = uriObject,
                    ) { result -> handleResult(result, resultCallback) }
                } else {
                    NamiCampaignManager.launch(
                        theActivity,
                        paywallActionCallback = paywallActionCallback,
                    ) { result -> handleResult(result, resultCallback) }
                }
            }
        }
    }

    private fun handlePaywallCallback(
        paywallEvent: NamiPaywallEvent,
        actionCallback: Callback,
    ) {
        val actionString = paywallEvent.action.toRNActionString()
        val purchasesArray = createPurchaseArray(paywallEvent.purchases)

        val resultMap =
            Arguments.createMap().apply {
                putString(CAMPAIGN_ID, paywallEvent.campaignId)
                putString(CAMPAIGN_LABEL, paywallEvent.campaignLabel ?: "")
                putString(PAYWALL_ID, paywallEvent.paywallId)
                putString(ACTION, actionString)
                putString(PURCHASE_ERROR, paywallEvent.purchaseError ?: "")
                putArray(PURCHASES, purchasesArray)
                putString(CAMPAIGN_NAME, paywallEvent.campaignName ?: "")
                putString(CAMPAIGN_TYPE, paywallEvent.campaignType ?: "")
                putString(CAMPAIGN_URL, paywallEvent.campaignUrl ?: "")
                putString(PAYWALL_NAME, paywallEvent.paywallName ?: "")
                putString(SEGMENT_ID, paywallEvent.segmentId ?: "")
                putString(EXTERNAL_SEGMENT_ID, paywallEvent.externalSegmentId ?: "")
                putString(DEEP_LINK_URL, paywallEvent.deeplinkUrl ?: "")
            }

        if (paywallEvent.sku != null) {
            val skuMap =
                Arguments.createMap().apply {
                    putString("id", paywallEvent.sku?.id ?: "")
                    putString("skuId", paywallEvent.sku?.skuId ?: "")
                    putString("name", paywallEvent.sku?.name ?: "")
                    putString(
                        "type",
                        paywallEvent.sku
                            ?.type
                            .toString()
                            .lowercase(),
                    )
                }
            resultMap.putMap(SKU, skuMap)
        }

        if (paywallEvent.componentChange != null) {
            val componentChangeMap =
                Arguments.createMap().apply {
                    putString("id", paywallEvent.componentChange?.id ?: "")
                    putString("name", paywallEvent.componentChange?.name ?: "")
                }

            resultMap.putMap(COMPONENT_CHANGE, componentChangeMap)
        }

        if (paywallEvent.videoMetadata != null) {
            val videoMetadataMap =
                Arguments.createMap().apply {
                    putString("id", paywallEvent.videoMetadata?.id ?: "")
                    putString("name", paywallEvent.videoMetadata?.name ?: "")
                    putString("url", paywallEvent.videoMetadata?.url ?: "")
                    putBoolean("autoplayVideo", paywallEvent.videoMetadata?.autoplayVideo ?: false)
                    putBoolean("muteByDefault", paywallEvent.videoMetadata?.muteByDefault ?: false)
                    putBoolean("loopVideo", paywallEvent.videoMetadata?.loopVideo ?: false)
                    putDouble("contentDuration", paywallEvent.videoMetadata?.contentDuration ?: 0.0)
                    putDouble("contentTimecode", paywallEvent.videoMetadata?.contentTimecode ?: 0.0)
                }

            resultMap.putMap(VIDEO_METADATA, videoMetadataMap)
        }

        if (paywallEvent.timeSpentOnPaywall != null) {
            resultMap.putDouble(TIME_SPENT_ON_PAYWALL, paywallEvent.timeSpentOnPaywall ?: 0.0)
        }

        emitEvent(NAMI_PAYWALL_EVENT, resultMap)
    }

    private fun createPurchaseArray(purchases: List<NamiPurchase>?): WritableArray =
        WritableNativeArray().apply {
            purchases?.forEach { purchase ->
                try {
                    pushMap(purchase.toPurchaseDict())
                } catch (e: Exception) {
                    Log.e(NAME, "Error while converting data in createPurchaseArray to a Map", e)
                }
            }
        }

    private fun emitEvent(
        event: String,
        map: WritableMap,
    ) {
        val emitter = reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        if (emitter is DeviceEventManagerModule.RCTDeviceEventEmitter) {
            emitter.emit(event, map)
        } else {
            Log.w(NAME, "Cannot emit $event event: RCTDeviceEventEmitter instance is null")
        }
    }

    /**
     * Maps Android LaunchCampaignError enum values to iOS-compatible error codes
     * to ensure consistent error handling across platforms in React Native.
     */
    private fun mapErrorCodeToIOS(androidError: LaunchCampaignError): Int =
        when (androidError) {
            LaunchCampaignError.DEFAULT_CAMPAIGN_NOT_FOUND -> 0
            LaunchCampaignError.LABELED_CAMPAIGN_NOT_FOUND -> 1
            LaunchCampaignError.CAMPAIGN_DATA_NOT_FOUND -> 2
            LaunchCampaignError.PAYWALL_ALREADY_DISPLAYED -> 3
            LaunchCampaignError.SDK_NOT_INITIALIZED -> 4
            LaunchCampaignError.URL_CAMPAIGN_NOT_FOUND -> 6
            LaunchCampaignError.PRODUCT_GROUPS_NOT_FOUND -> 8
        }

    private fun handleResult(
        result: LaunchCampaignResult,
        resultCallback: Callback,
    ) {
        when (result) {
            is LaunchCampaignResult.Success -> {
                resultCallback.invoke(true)
            }
            is LaunchCampaignResult.Failure -> {
                val error = result.error
                val errorInfo =
                    if (error is LaunchCampaignError) {
                        Arguments.createMap().apply {
                            putInt("code", mapErrorCodeToIOS(error))
                            putString("domain", "LaunchCampaignError")
                            putString("message", error.errorMessage.ifEmpty { error.toString() })
                        }
                    } else {
                        Arguments.createMap().apply {
                            putInt("code", -1)
                            putString("domain", "Unknown")
                            putString("message", error.toString())
                        }
                    }
                resultCallback.invoke(false, errorInfo)
            }
        }
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
    fun isCampaignAvailable(
        campaignSource: String?,
        promise: Promise,
    ) {
        val isCampaignAvailable =
            when {
                campaignSource == null -> NamiCampaignManager.isCampaignAvailable()
                campaignSource.toUri().scheme != null ->
                    NamiCampaignManager.isCampaignAvailable(campaignSource.toUri())
                else -> NamiCampaignManager.isCampaignAvailable(campaignSource)
            }
        promise.resolve(isCampaignAvailable)
    }

    @ReactMethod
    fun isFlow(
        label: String?,
        withUrl: String?,
        promise: Promise,
    ) {
        try {
            val uri =
                if (!withUrl.isNullOrEmpty()) {
                    val parsedUri = Uri.parse(withUrl)
                    if (parsedUri.scheme.isNullOrEmpty()) {
                        promise.reject("ISFLOW_ERROR", "Invalid URL format: missing scheme", null)
                        return
                    }
                    parsedUri
                } else {
                    null
                }
            val result = NamiCampaignManager.isFlow(label = label, uri = uri)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ISFLOW_ERROR", "Failed to check if campaign is flow: ${e.message}", e)
        }
    }

    @ReactMethod
    fun refresh(promise: Promise) {
        NamiCampaignManager.refresh { campaigns ->
            val array = WritableNativeArray()
            campaigns?.forEach { campaign ->
                array.pushMap(campaignToReadableMap(campaign))
            }
            promise.resolve(array)
        }
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

    @ReactMethod
    fun productGroups(
        label: String?,
        withUrl: String?,
        promise: Promise,
    ) {
        try {
            val uri =
                if (!withUrl.isNullOrEmpty()) {
                    val parsedUri = Uri.parse(withUrl)
                    if (parsedUri.scheme.isNullOrEmpty()) {
                        promise.reject("PRODUCTGROUPS_ERROR", "Invalid URL format: missing scheme", null)
                        return
                    }
                    parsedUri
                } else {
                    null
                }

            val productGroups = NamiCampaignManager.productGroups(label = label, uri = uri)
            val array = WritableNativeArray()
            productGroups.forEach { group ->
                array.pushString(group)
            }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("PRODUCTGROUPS_ERROR", "Failed to get product groups: ${e.message}", e)
        }
    }
}
