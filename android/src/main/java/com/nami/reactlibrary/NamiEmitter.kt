package com.nami.reactlibrary
import android.util.Log
import android.widget.Toast
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.namiml.NamiPaywallManager
import com.namiml.api.model.SKU
import com.namiml.api.model.NamiPaywall
import com.namiml.databinding.NamiSkuButtonGroupBinding
import com.namiml.entitlement.billing.NamiSKU
import java.lang.ref.WeakReference
import java.util.ArrayList
public class NamiEmitter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    fun NamiEmitter(reactContext: ReactApplicationContext?) {
        Log.e("ReactNative", "In Emitter Initialize(reactContext)")
        NamiPaywallManager.registerApplicationPaywallProvider { context, paywallData, products, developerPaywallId ->
            val productList:List<NamiSKU> =  ArrayList<NamiSKU>() //products ?: ArrayList<NamiSKU>()
            emitPaywallRaise(context, paywallData, productList, developerPaywallId)
        }
        NamiPaywallManager.registerApplicationSignInProvider { context, paywallData, developerPaywallId ->
            currentActivity?.let {
                emitSignInActivated(WeakReference(it) , paywallData, developerPaywallId)
            }
        }
    }
    override fun onCatalystInstanceDestroy() {
    }
    override fun getName(): String {
        return "NamiEmitter"
    }
    override fun canOverrideExistingModule(): Boolean {
        return false
    }
    override fun initialize() {
//        hasNamiEmitterListeners = NO;
//
//        // Tell Nami to listen for purchases and we'll forward them on to listeners
//        [[NamiStoreKitHelper shared] registerWithPurchasesChangedHandler:^(NSArray<NamiMetaPurchase *> * _Nonnull products, enum NamiPurchaseState purchaseState, NSError * _Nullable error) {
//            [self sendEventPurchased];
//        }];
//
//        [NamiPaywallManager registerWithApplicationSignInProvider:^(UIViewController * _Nullable fromVC, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nonnull paywallMetadata) {
//            [self sendSignInActivateFromVC:fromVC forPaywall:developerPaywallID paywallMetadata:paywallMetadata];
//        }];
        NamiPaywallManager.registerApplicationSignInProvider { context, paywallData, developerPaywallID ->
            Toast.makeText(context, "Sign in clicked", Toast.LENGTH_SHORT).show()
        }
        Log.e("ReactNative", "In Emitter Initialize()")
        NamiPaywallManager.registerApplicationPaywallProvider { context, paywallData, products, developerPaywallId ->
            var sendProducts: List<NamiSKU> = ArrayList<NamiSKU>() //products ?: ArrayList<NamiSKU>()
            emitPaywallRaise(context, paywallData, sendProducts, developerPaywallId)
        }
//
//        [NamiPaywallManager registerWithApplicationPaywallProvider:^(UIViewController * _Nullable fromVC, NSArray<NamiMetaProduct *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nonnull paywallMetadata) {
//            [self sendPaywallActivatedFromVC:fromVC forPaywall:developerPaywallID withProducts:products paywallMetadata:paywallMetadata];
//        }];
    }
    fun emitPaywallRaise(activity: android.content.Context, paywallData: NamiPaywall, productDicts: List<NamiSKU>, paywallDeveloperID: String? )   {
//        if (hasNamiEmitterListeners) {
//            NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
//            for (NamiMetaProduct *product in products) {
//                [productDicts addObject:[NamiBridgeUtil productToProductDict:product]];
//            }
//
//            [self sendEventWithName:@"AppPaywallActivate" body:@{ @"products": productDicts,
//                @"developerPaywallID": developerPaywallID,
//                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
//        }

        Log.e("NAMI","Emitting paywall raise signal for developerID" + paywallDeveloperID);
        val map = Arguments.createMap()
        map.putString("developerPaywallID", paywallDeveloperID )

        // Populate paywall metadata map
        val paywallMap: WritableMap = paywallToPaywallDict(paywallData)
        map.putMap("paywallMetadata", paywallMap)

        // Populate SKU details
        val skusArray: WritableArray = Arguments.createArray()

        for (sku in productDicts) {
            val skuMap = skuToSkuDict(sku)
            skusArray.pushMap(skuMap)
        }

        map.putArray("skus", skusArray)

        try {
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("AppPaywallActivate", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }
    }
    public fun emitSignInActivated(activity: java.lang.ref.WeakReference<android.app.Activity>, paywallData: NamiPaywall, paywallDeveloperID: String?)  {
//        if (hasNamiEmitterListeners) {
//            // Pass along paywall ID and paywall metadata for use in sign-in provider.
//            [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
//                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
//        }
        val map = Arguments.createMap()
        map.putString("developerPaywallID", paywallDeveloperID )
        map.putString("paywallMetadata", "Need TO Map NamiPaywall Object")
        try {
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("SignInActivate", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }
    }
    public fun emitPurchaseMade(paywallDeveloperID: String)  {
//        if (hasNamiEmitterListeners) {
//            NSArray<NamiMetaPurchase *> *purchases = NamiStoreKitHelper.shared.allPurchasedProducts;
//            NSMutableArray<NSString *> *productIDs = [NSMutableArray new];
//            for (NamiMetaProduct *purchase in purchases) {
//                [productIDs addObject:purchase.productIdentifier];
//            }
//
//            [self sendEventWithName:@"PurchasesChanged" body:@{@"products": productIDs}];
//        }
        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        try {
            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("customEventName", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }
    }
}