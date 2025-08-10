package com.namiml.reactnative

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.facebook.react.bridge.UiThreadUtil

@ReactModule(name = NamiOverlayControlBridgeModule.NAME)
class NamiOverlayControlBridgeModule(private val ctx: ReactApplicationContext)
  : ReactContextBaseJavaModule(ctx), TurboModule {

  companion object { const val NAME = "RNNamiOverlayControl" }

  override fun getName() = NAME

  @ReactMethod
  fun presentOverlay(promise: Promise) {
    Log.w(NAME, "Present overlay $currentActivity instance")
    val activity = currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "No current activity available")
      return
    }

    try {
      UiThreadUtil.runOnUiThread {
        val intent = Intent(activity, ReactOverlayActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
        activity.startActivity(intent)
        activity.overridePendingTransition(0, 0)
        promise.resolve(null)
      }
    } catch (e: Exception) {
      promise.reject("PRESENT_OVERLAY_ERROR", "Failed to present overlay", e)
    }
  }

  @ReactMethod
  fun finishOverlay(result: ReadableMap?, promise: Promise) {
    try {
      // Emit result to main app listeners
      val payload: WritableMap = Arguments.createMap().apply {
        if (result != null && result is ReadableMap) {
          merge(result)
        }
      }
      if (ctx.hasActiveCatalystInstance()) {
        ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("NamiOverlayResult", payload)
      }
      UiThreadUtil.runOnUiThread {
        (ctx.currentActivity as? ReactOverlayActivity)?.apply {
          finish()
          overridePendingTransition(0, 0)
        }
        promise.resolve(null)
      }
    } catch (e: Exception) {
      promise.reject("FINISH_OVERLAY_ERROR", "Failed to finish overlay", e)
    }
  }
}
