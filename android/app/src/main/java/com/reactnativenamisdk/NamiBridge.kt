package com.reactnativenamisdk

import android.content.Context
import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.namiml.BuildConfig
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLogLevel

import com.reactnativenamisdk.MainActivity

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

class NamiBridge : NativeModule {

    internal fun configureWithAppID(appID: String) {

//        Context useContext = MainActivity.getContext();
//        Possible alternative way to get a context

//        try {
//            val activityThreadClass = Class.forName("android.app.ActivityThread")
//            val method: Method = activityThreadClass.getMethod("currentApplication")
//            return method.invoke(null, null as Array<Any?>?) as Application
//        } catch (e: ClassNotFoundException) { // handle exception
//        } catch (e: NoSuchMethodException) { // handle exception
//        } catch (e: IllegalArgumentException) { // handle exception
//        } catch (e: IllegalAccessException) { // handle exception
//        } catch (e: InvocationTargetException) { // handle exception
//        }

        val namiConfig: NamiConfiguration = NamiConfiguration.build(context = MainActivity.getContext(), appId = appID) {
            namiLogLevel = NamiLogLevel.DEBUG.takeIf { BuildConfig.DEBUG } ?: NamiLogLevel.ERROR
        }
        Nami.configure(namiConfiguration = namiConfig)

//        [[Nami shared] configureWithAppID:appID];

    }

    internal fun enterCoreContentWithLabel(label: String) {
//        [Nami enterCoreContentWithLabel:label];
    }

    internal fun exitCoreContentWithLabel(label: String) {
//        [Nami exitCoreContentWithLabel:label];
    }

    internal fun coreActionWithLabel(label: String) {
//        [Nami coreActionWithLabel:label];
    }

    override fun onCatalystInstanceDestroy() {

    }

    override fun getName(): String {
        return "NamiBridge"
    }

    override fun canOverrideExistingModule(): Boolean {
        return false;
    }

    override fun initialize() {
    }

}