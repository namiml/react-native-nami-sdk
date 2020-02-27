package com.reactnativenamisdk;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Nami";
  }

  @SuppressLint("StaticFieldLeak")
  private static Context context;
  private static ReactContext reactContext;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    context = getApplicationContext();
  }

  public static Context getContext() {
    Toast.makeText(context, "Got my context!",
            Toast.LENGTH_LONG).show();
    return context;
  }

  public static ReactContext getReactContext() {
    Toast.makeText(context, "Got my react context!",
            Toast.LENGTH_LONG).show();
    return reactContext;
  }

}
