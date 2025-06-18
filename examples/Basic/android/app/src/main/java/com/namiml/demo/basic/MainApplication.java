package com.namiml.demo.basic;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.io.InputStream;
import java.util.List;
import com.namiml.resources.NamiResourceManager;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
//          packages.add(new com.swmansion.rnscreens.RNScreensPackage());
          packages.add(new RNConfigPackage());
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

      // Preload Nami resources in the background
      new Thread(() -> {
          try {
              InputStream videoStream = getAssets().open("onboarding.mp4");
              byte[] videoBytes = new byte[videoStream.available()];
              videoStream.read(videoBytes);
              videoStream.close();

              NamiResourceManager.registerResource(this, "https://static.www.nfl.com/video/upload/league/apps/mobile/video/onboarding.mp4", videoBytes);

              android.util.Log.d("NamiDemo", "Registered onboarding video resource");
          } catch (Exception e) {
              android.util.Log.d("NamiDemo", "Failed to register onboarding video: " + e.getMessage());
          }
      }).start();
  }
}
