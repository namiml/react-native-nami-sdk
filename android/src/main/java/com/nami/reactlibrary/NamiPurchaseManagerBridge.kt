package com.nami.reactlibrary


import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.billing.NamiPurchase
import com.namiml.billing.NamiPurchaseManager
import com.namiml.billing.NamiPurchaseState

class NamiPurchaseManagerBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NamiPurchaseManagerBridge"
    }

    override fun initialize() {
        // TODO: Register for purchase callbacks
        NamiPurchaseManager.registerPurchasesChangedHandler { list, namiPurchaseState, s ->
            emitPurchaseMade(list, namiPurchaseState, s)
        }
    }

    public fun emitPurchaseMade(purchases: List<NamiPurchase>, purchaseState: NamiPurchaseState, errorString: String? ) {
//   NSArray<NamiPurchase *> *purchases = [NamiPurchaseManager allPurchases];
//        NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
//        for (NamiPurchase *purchase in purchases) {
//            [productIDs addObject:purchase.skuID];
//        }
//
//        NSString *convertedState = [self purchaseStateToString:purchaseState];
//
//        [self sendEventWithName:@"PurchasesChanged" body:@{@"products": productIDs,
//                                                           @"purchaseState": convertedState,
//                                                           @"errorDescription": [error localizedDescription] }];
        val map = Arguments.createMap()
        errorString?.let {
            map.putString("errorDescription", errorString)
        }
        val productIDs = Arguments.createArray()
        for (purchase in purchases) {
            val skuID = purchase.skuId
            productIDs.pushString(skuID)
        }
        map.putArray("skuIDs", productIDs)

        val convertedState: String
        if (purchaseState == NamiPurchaseState.PURCHASED) {
            convertedState = "PURCHASED"
        } else if (purchaseState == NamiPurchaseState.FAILED) {
            convertedState = "FAILED"
        } else {
            convertedState = "UNKNOWN"
        }
        map.putString("purchaseState", convertedState)


        Log.i("NamiBridge", "Emitting purchase with state " + convertedState + " for IDs " + productIDs)
        try {
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("PurchasesChanged", map)
        } catch (e: Exception) {
            Log.e("NamiBridge", "Caught Exception: " + e.message)
        }
    }

    @ReactMethod
    fun clearBypassStorePurchases() {
        Log.e("NamiBridge", "Bypass store not yet implemented for Android.")
        NamiPurchaseManager.clearBypassStorePurchases()
    }


    @ReactMethod
    fun buySKU(skuPlatformID: String, developerPaywallID: String, resultsCallback: Callback) {
        currentActivity?.let {
            NamiPurchaseManager.buySKU(it, skuPlatformID) {

                // Currently not sure how to check if purchase worked?  Just return false.
                val resultArray: WritableArray = WritableNativeArray()
                resultArray.pushBoolean(false)
                resultsCallback.invoke(resultArray)
            }
        }
    }

    @ReactMethod
    fun purchases(resultsCallback: Callback) {
        val purchases = NamiPurchaseManager.allPurchases()

        // Pass back empty array until we can get purchases from the SDK
        var resultArray: WritableArray = WritableNativeArray()

        for (purchase in purchases) {
            val purchaseDict = purchaseToPurchaseDict(purchase)
            resultArray.pushMap(purchaseDict)
        }

        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun isSKUPurchased(skuID: String, resultsCallback: Callback) {
        val isPurchased = NamiPurchaseManager.isSKUIDPurchased(skuID)

        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushBoolean(isPurchased)
        resultsCallback.invoke(resultArray)
    }

    @ReactMethod
    fun anySKUPurchased(skuIDs: ReadableArray, resultsCallback: Callback) {
        var isPurchased = false
        //TODO : expose Android Active Purchases
        for (purchase in NamiPurchaseManager.allPurchases()) {
            purchase.skuId?.let {
                if (NamiPurchaseManager.isSKUIDPurchased(it)) {
                    isPurchased = true
                }
            }
        }

        val resultArray: WritableArray = WritableNativeArray()
        resultArray.pushBoolean(isPurchased)
        resultsCallback.invoke(resultArray)
    }

}