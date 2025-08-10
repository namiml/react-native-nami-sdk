package com.namiml.reactnative;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.namiml.reactnative.BuildConfig;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NamiBridgePackage extends TurboReactPackage {

    @Override
    public NativeModule getModule(String name, ReactApplicationContext context) {
        return switch (name) {
            case NamiBridgeModule.NAME -> new NamiBridgeModule(context);
            case NamiCampaignManagerBridgeModule.NAME ->
                    new NamiCampaignManagerBridgeModule(context);
            case NamiEntitlementManagerBridgeModule.NAME ->
                    new NamiEntitlementManagerBridgeModule(context);
            case NamiCustomerManagerBridgeModule.NAME ->
                    new NamiCustomerManagerBridgeModule(context);
            case NamiFlowManagerBridgeModule.NAME -> new NamiFlowManagerBridgeModule(context);
            case NamiPaywallManagerBridgeModule.NAME -> new NamiPaywallManagerBridgeModule(context);
            case NamiPurchaseManagerBridgeModule.NAME ->
                    new NamiPurchaseManagerBridgeModule(context);
            case NamiOverlayControlBridgeModule.NAME ->
                    new NamiOverlayControlBridgeModule(context);
            default -> null;
        };
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();

            // Declare all TurboModules here
            moduleInfos.put(
                    NamiBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiBridgeModule.NAME,
                            NamiBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiCampaignManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiCampaignManagerBridgeModule.NAME,
                            NamiCampaignManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiEntitlementManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiEntitlementManagerBridgeModule.NAME,
                            NamiEntitlementManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiCustomerManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiCustomerManagerBridgeModule.NAME,
                            NamiCustomerManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiFlowManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiFlowManagerBridgeModule.NAME,
                            NamiFlowManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiPaywallManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiPaywallManagerBridgeModule.NAME,
                            NamiPaywallManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiPurchaseManagerBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiPurchaseManagerBridgeModule.NAME,
                            NamiPurchaseManagerBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );

            moduleInfos.put(
                    NamiOverlayControlBridgeModule.NAME,
                    new ReactModuleInfo(
                            NamiOverlayControlBridgeModule.NAME,
                            NamiOverlayControlBridgeModule.NAME,
                            false,
                            false,
                            true,
                            false,
                            BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
                    )
            );
            return moduleInfos;
        };
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext context) {
        return Collections.emptyList();
    }
}
