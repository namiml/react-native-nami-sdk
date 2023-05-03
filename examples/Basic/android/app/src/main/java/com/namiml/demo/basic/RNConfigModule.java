package com.namiml.demo.basic;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class RNConfigModule extends ReactContextBaseJavaModule {
   RNConfigModule(ReactApplicationContext context) {
       super(context);
   }

    @Override
    public String getName() {
        return "RNConfig";
    }

    @ReactMethod
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("FLAVOR", BuildConfig.FLAVOR);
        return constants;
    }
}
