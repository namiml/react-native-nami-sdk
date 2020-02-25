package com.reactnativenamisdk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Promise
import android.util.Log
import com.namiml.Nami


class Nami : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext):
            MutableList<ViewManager<out View, out ReactShadowNode<*>>> {
        return mutableListOf()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext):
            MutableList<NativeModule> {
        return mutableListOf(NamiBridge(), NamiEmitter(), NamiPaywallManagerBridge(), NamiStoreKitHelperBridge() )
    }
}

class NamiBridge : ReactContextBaseJavaModule {

    internal fun configureWithAppID(appID: String): Void {
//        [[Nami shared] configureWithAppID:appID];

    }

    internal fun enterCoreContentWithLabel(label: String): Void {
//        [Nami enterCoreContentWithLabel:label];
    }

    internal fun exitCoreContentWithLabel(label: String): Void {
//        [Nami exitCoreContentWithLabel:label];
    }

    internal fun coreActionWithLabel(label: String): Void {
        [Nami coreActionWithLabel:label];
    }

}