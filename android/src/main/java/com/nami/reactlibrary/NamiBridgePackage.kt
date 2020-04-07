package com.nami.reactlibrary

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.JavaScriptModule
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.shell.MainReactPackage
import com.facebook.react.uimanager.ViewManager
import java.util.*


class NamiBridgePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val moduleList: MutableList<NativeModule> = ArrayList()
        moduleList.add(NamiBridgeModule(reactContext))
        moduleList.add(NamiPaywallManagerBridgeModule(reactContext))
        moduleList.add(NamiPurchaseManagerBridgeModule(reactContext))
        moduleList.add(NamiEntitlementManagerBridgeModule(reactContext))
        moduleList.add(NamiEmitter(reactContext))
        return moduleList
    }

    fun createJSModules(): List<Class<out JavaScriptModule?>>? {
        return null
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    protected fun getPackages(): List<ReactPackage>? {
        return Arrays.asList<ReactPackage>(
                MainReactPackage(),
                NamiBridgePackage()
        )
    }
}