package com.nami.reactlibrary;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.uimanager.ViewManager;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class NamiBridgePackage implements ReactPackage {
    @NotNull
    @Override
    public List<NativeModule> createNativeModules(@NotNull ReactApplicationContext reactContext) {
        List<NativeModule> moduleList = new ArrayList<NativeModule>();
        moduleList.add(new NamiBridgeModule(reactContext));
        moduleList.add(new NamiPaywallManagerBridgeModule(reactContext));
        moduleList.add(new NamiPurchaseManagerBridgeModule(reactContext));
        moduleList.add(new NamiEntitlementManagerBridgeModule(reactContext));
        moduleList.add(new NamiMLManagerBridgeModule(reactContext));
        moduleList.add(new NamiCustomerManagerBridgeModule(reactContext));
        moduleList.add(new NamiCampaignManagerBridgeModule(reactContext));
        moduleList.add(new NamiEmitter(reactContext));

        return moduleList;
    }

    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return null;
    }

    @NotNull
    @Override
    public List<ViewManager> createViewManagers(@NotNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    protected List<ReactPackage> getPackages() {
        return Arrays.asList(
                new MainReactPackage(),
                new NamiBridgePackage()
        );
    }
}
