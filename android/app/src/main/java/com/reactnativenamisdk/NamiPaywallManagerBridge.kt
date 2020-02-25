package com.reactnativenamisdk


import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import android.util.Log


class NamiPaywallManagerBridge : NativeModule {

    internal fun raisePaywall(): Void {
//        [[NamiPaywallManager shared] raisePaywallFromVC:nil];

        Log.e("ReactNative", "Raising Paywall: ")
    }

    internal fun presentNamiPaywall(products: String, metaPaywallDefinition: String): Void {
        // Array of product dicts, and dictionary of paywall metadata from Nami

//        NSString *paywallDeveloperID = paywallDict[@"developerPaywallID"];
//        if ( paywallDeveloperID != nil ) {
//            [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:paywallDeveloperID :^(NSArray<NamiMetaProduct *> * _Nullable products, NSString * _Nonnull paywallDevloperID, NamiMetaPaywall * _Nullable namiMetaPaywall) {
//                [[NamiPaywallManager shared] presentNamiPaywallFromVC:nil products:products paywallMetadata:namiMetaPaywall backgroundImage:namiMetaPaywall.backgroundImage forNami:false];
//            }];
//        } else {
//            // No way to handle this case for now as we cannot cretae a NamiMetaPaywall
//        }
//
        Log.e("ReactNative", "Raising Nami Paywall: ")
    }

    internal fun fetchCustomPaywallMetaForDeveloperID(developerPaywallID: String, p: Promise): Void {

//        [NamiPaywallManager fetchCustomPaywallMetaForDeveloperID:developerPaywallID :^(NSArray<NamiMetaProduct *> * _Nullable products, NSString * _Nonnull developerPaywallID, NamiMetaPaywall * _Nullable paywallMetadata) {
//            NSMutableArray<NSDictionary<NSString *,NSString *> *> *productDicts = [NSMutableArray new];
//            for (NamiMetaProduct *product in products) {
//            [productDicts addObject:[NamiBridgeUtil productToProductDict:product]];
//        }
//            NSArray *wrapperArray = @[@{ @"products": productDicts,
//                @"developerPaywallID": developerPaywallID,
//                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
//            completion(wrapperArray);
//        }];

        //    NSArray *wrapperArray = @[@{ @"products": productDicts,
        //      @"developerPaywallID": developerPaywallID,
        //      @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];

        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }


    internal fun canRaisePaywall(p: Promise): Void {
//        BOOL canRaise = [[NamiPaywallManager shared] canRaisePaywall];
//        completion(@[[NSNumber numberWithBool:canRaise]]);

        val map = Arguments.createMap()
        map.putString("key1", "Value1")
        map.putString("key1", "Value1")
        p.resolve(map)
    }
}