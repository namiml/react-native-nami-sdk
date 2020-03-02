package com.nami.reactlibrary;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.JavaScriptModule;

import org.jetbrains.annotations.NotNull;


public class NamiBridgePackage implements ReactPackage {
    @NotNull
    @Override
    public List<NativeModule> createNativeModules(@NotNull ReactApplicationContext reactContext) {
        List<NativeModule> moduleList = new ArrayList<NativeModule>();
        moduleList.add(new NamiBridgeModule(reactContext));
        moduleList.add(new NamiPaywallManagerBridgeModule(reactContext));

        return moduleList;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return null;
    }

    @NotNull
    @Override
    public List<ViewManager> createViewManagers(@NotNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
    
}



