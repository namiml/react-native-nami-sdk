package com.reactnativenamisdk;

import android.app.Application;
import android.content.Context;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.ArrayList;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return true;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          ReactPackage namiPackage = new Nami();
          ArrayList<ReactPackage> packages = new ArrayList<ReactPackage>();
          packages.add(namiPackage);
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context  Loading Flipper
   */
private static void initializeFlipper(Context context) {
  try {
    /*
     We use reflection here to pick up the class that initializes Flipper,
    since Flipper library is not available in release mode
    */
    Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
    aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
  } catch (ClassNotFoundException | NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
    e.printStackTrace();
  }
}
}
