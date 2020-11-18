package com.nami.reactlibrary

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class NamiAnalyticsEmitter(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
//    fun NamiEmitter(reactContext: ReactApplicationContext?) {
//        Log.e("ReactNative", "In Emitter Initialize(reactContext)")
//        NamiPaywallManager.registerApplicationPaywallProvider { context, paywallData, products, developerPaywallId ->
//
//            Log.e("ReactNativeAndroidDridge", "products from regsiterApplicationPaywallProvider callback are " + products)
//
//            val productList: List<NamiSKU> =  products ?: ArrayList<NamiSKU>()
//            emitPaywallRaise(context, paywallData, productList, developerPaywallId)
//        }
//        NamiPaywallManager.registerApplicationSignInProvider { context, paywallData, developerPaywallId ->
//            currentActivity?.let {
//                emitSignInActivated(WeakReference(it), paywallData, developerPaywallId)
//            }
//        }
//    }

    override fun onCatalystInstanceDestroy() {
    }

    override fun getName(): String {
        return "NamiAnaltyicsEmitter"
    }

    override fun canOverrideExistingModule(): Boolean {
        return false
    }

    override fun initialize() {

//        [NamiAnalyticsSupport registerAnalyticsHandlerWithHandler: ^(NamiAnalyticsActionType actionType , NSDictionary<NSString *,id> * _Nonnull anaytlicsDict) {
//            [self sendAnalyticsEventForAction:actionType anayticsItems:anaytlicsDict];
//        }];


    }


//    public fun emitSignInActivated(activity: java.lang.ref.WeakReference<android.app.Activity>, paywallData: NamiPaywall, paywallDeveloperID: String?) {
////        if (hasNamiEmitterListeners) {
////            // Pass along paywall ID and paywall metadata for use in sign-in provider.
////            [self sendEventWithName:@"SignInActivate" body:@{ @"developerPaywallID": developerPaywallID,
////                @"paywallMetadata": paywallMetadata.namiPaywallInfoDict, }];
////        }
//        val map = Arguments.createMap()
//        map.putString("developerPaywallID", paywallDeveloperID)
//        map.putString("paywallMetadata", "Need TO Map NamiPaywall Object")
//        try {
//            reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
//                    .emit("SignInActivate", map)
//        } catch (e: Exception) {
//            Log.e("ReactNative", "Caught Exception: " + e.message)
//        }
//    }


    // Future work to convert this ObjC code:
//
//    - (NSDictionary *) productDictIfProductPresentInAnalyticsItems:(NSDictionary *)anayticsItems forKey:(NSString *)key {
//        NamiSKU *product = (NamiSKU *)anayticsItems[key];
//        if (product != NULL && [product isKindOfClass:[NamiSKU class]] ) {
//            return [NamiBridgeUtil skuToSKUDict:product];
//        } else {
//            return NULL;
//        }
//    }
//
//
//
//    - (NSDictionary <NSString *, id> *) sanitizeAnalyticsItems:(NSDictionary *)anayticsItems {
//        NSMutableDictionary<NSString *, id> *sanitizedDictionary = [NSMutableDictionary dictionaryWithDictionary:anayticsItems];
//
//        id rawProducts = anayticsItems[@"paywallProducts"];
//        if ([rawProducts isKindOfClass:[NSArray class]]) {
//            NSMutableArray<NSDictionary *> *productsSanitized = [NSMutableArray new];
//            for (NamiSKU *product in (NSArray *)rawProducts) {
//            [productsSanitized addObject:[NamiBridgeUtil skuToSKUDict:product]];
//        }
//            sanitizedDictionary[@"paywallProducts"] = productsSanitized;
//        }
//
//
//        NSDate *purchseTimestamp = (NSDate *)(anayticsItems[@"purchasedProductPurchaseTimestamp"]);
//        if (purchseTimestamp != NULL && [purchseTimestamp isKindOfClass:[NSDate class]])
//        {
//            sanitizedDictionary[@"purchasedProductPurchaseTimestamp"] = [NamiBridgeUtil javascriptDateFromNSDate:purchseTimestamp];
//        }
//
//        NSDictionary *purchasedProductDict = [self productDictIfProductPresentInAnalyticsItems:anayticsItems forKey:@"purchasedProduct"];
//        if ( purchasedProductDict != NULL ) {
//            sanitizedDictionary[@"purchasedProduct"] = purchasedProductDict;
//            sanitizedDictionary[@"purchasedProductPrice"] = purchasedProductDict[@"price"];
//            sanitizedDictionary[@"purchasedProductLocale"] = purchasedProductDict[@"priceLocale"];
//        }
//
//        NSNumber *activityType = anayticsItems[@"purchaseActivityType"];
//        if (activityType != NULL && [activityType isKindOfClass:[NSNumber class]] ) {
//            switch (activityType.intValue) {
//                case 0: //newPurchase
//                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"newPurchase";
//                break;
//                case 1: // cancelled
//                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"cancelled";
//                break;
//                case 2: // resubscribe
//                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"resubscribe";
//                break;
//                case 3: // restored
//                sanitizedDictionary[@"purchaseActivityType_ActivityType"] = @"restored";
//                break;
//                default:
//                break;
//            }
//        }
//
//        return sanitizedDictionary;
//    }


}