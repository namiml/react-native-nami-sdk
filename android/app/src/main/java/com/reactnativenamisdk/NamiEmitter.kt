package com.reactnativenamisdk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise

import android.util.Log

import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLogLevel
import com.namiml.BuildConfig

class NamiEmitter : NativeModule {

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


//
//        [NamiPaywallManager registerWithApplicationPaywallProvider:^(UIViewController * _Nullable fromVC, NSArray<NamiMetaProduct *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nonnull paywallMetadata) {
//            [self sendPaywallActivatedFromVC:fromVC forPaywall:developerPaywallID withProducts:products paywallMetadata:paywallMetadata];
//        }];


    }

    internal fun emitPaywallRaise(paywallDeveloperID: String): Void {
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

        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")

        try {
            getReactInstanceManager().getCurrentReactContext()!!
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("customEventName", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }

    }

    internal fun emitSignInActivated(paywallDeveloperID: String): Void {
//        if (hasNamiEmitterListeners) {
//            // Pass along paywall ID and paywall metadata for use in sign-in provider.
//            [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
//                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
//        }

        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")

        try {
            getReactInstanceManager().getCurrentReactContext()!!
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("customEventName", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }

    }

    internal fun emitPurchaseMade(paywallDeveloperID: String): Void {

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
            getReactInstanceManager().getCurrentReactContext()!!
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("customEventName", map)
        } catch (e: Exception) {
            Log.e("ReactNative", "Caught Exception: " + e.message)
        }

    }

}