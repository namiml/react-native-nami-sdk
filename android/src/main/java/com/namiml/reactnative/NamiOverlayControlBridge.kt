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

  companion object {
    const val NAME = "RNNamiOverlayControl"
    var currentOverlayActivity: ReactOverlayActivity? = null
    var lastValidActivity: Activity? = null
  }

  override fun getName() = NAME

  @ReactMethod
  fun presentOverlay(promise: Promise) {
    var theActivity: Activity? = null
    if (reactApplicationContext.hasCurrentActivity()) {
      theActivity = reactApplicationContext.currentActivity

      // Check if it's the overlay activity that's finishing
      if (theActivity is ReactOverlayActivity) {
        if (theActivity.isFinishing || theActivity.isDestroyed) {
          theActivity = lastValidActivity
          if (theActivity == null || theActivity.isFinishing || theActivity.isDestroyed) {
            promise.reject("NO_ACTIVITY", "No valid activity available")
            return
          }
        } else {
          lastValidActivity = theActivity
        }
      } else {
        lastValidActivity = theActivity
      }
    } else {
      theActivity = lastValidActivity
      if (theActivity == null || theActivity.isFinishing || theActivity.isDestroyed) {
        promise.reject("NO_ACTIVITY", "No valid activity available")
        return
      }
    }

    if (theActivity == null) {
      promise.reject("NO_ACTIVITY", "No activity available")
      return
    }

    startOverlayActivity(theActivity, promise)
  }

  private fun startOverlayActivity(activity: Activity, promise: Promise) {
    try {
      UiThreadUtil.runOnUiThread {
        try {
          val intent = Intent(activity, ReactOverlayActivity::class.java)
          intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
          activity.startActivity(intent)
          // Use modern transition API for Android 14+ (API 34+)
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            activity.overrideActivityTransition(Activity.OVERRIDE_TRANSITION_OPEN, 0, 0)
          } else {
            @Suppress("DEPRECATION")
            activity.overridePendingTransition(0, 0)
          }

          // Emit ready event after a short delay to ensure activity is started
          android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            try {
              if (ctx.catalystInstance != null) {
                ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                  .emit("NamiOverlayReady", null)
              }
            } catch (e: Exception) {
              Log.e(NAME, "Failed to emit NamiOverlayReady: ${e.message}")
            }
          }, 100)

          promise.resolve(null)
        } catch (uiError: Exception) {
          Log.e(NAME, "Error in UI thread: ${uiError.message}", uiError)
          promise.reject("UI_THREAD_ERROR", "Failed in UI thread: ${uiError.message}", uiError)
        }
      }
    } catch (e: Exception) {
      Log.e(NAME, "Error presenting overlay: ${e.message}", e)
      promise.reject("PRESENT_OVERLAY_ERROR", "Failed to present overlay: ${e.message}", e)
    }
  }

  @ReactMethod
  fun addListener(eventName: String?) {
    // Required for NativeEventEmitter - no-op since we emit events directly
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
    // Required for NativeEventEmitter - no-op since we emit events directly
  }

  @ReactMethod
  fun finishOverlay(result: ReadableMap?, promise: Promise) {
    try {
      // Emit result to main app listeners
      val payload: WritableMap = Arguments.createMap().apply {
        if (result != null) {
          merge(result)
        }
      }
      try {
        if (ctx.catalystInstance != null) {
          ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NamiOverlayResult", payload)
        }
      } catch (e: Exception) {
        Log.e(NAME, "Failed to emit NamiOverlayResult: ${e.message}")
      }

      UiThreadUtil.runOnUiThread {
        // Try to finish the tracked overlay activity first
        currentOverlayActivity?.let { overlay ->
          overlay.finish()
          // Use modern transition API for Android 14+ (API 34+)
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            overlay.overrideActivityTransition(Activity.OVERRIDE_TRANSITION_CLOSE, 0, 0)
          } else {
            @Suppress("DEPRECATION")
            overlay.overridePendingTransition(0, 0)
          }
          currentOverlayActivity = null

          // Wait for activity to actually finish before resolving promise
          android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            promise.resolve(null)
          }, 100)
        } ?: run {
          // Fallback to current activity if it's an overlay
          (ctx.currentActivity as? ReactOverlayActivity)?.apply {
            finish()
            // Use modern transition API for Android 14+ (API 34+)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
              overrideActivityTransition(Activity.OVERRIDE_TRANSITION_CLOSE, 0, 0)
            } else {
              @Suppress("DEPRECATION")
              overridePendingTransition(0, 0)
            }

            // Wait for activity to actually finish before resolving promise
            android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
              promise.resolve(null)
            }, 100)
          } ?: run {
            promise.resolve(null)
          }
        }
      }
    } catch (e: Exception) {
      Log.e(NAME, "Failed to finish overlay: ${e.message}", e)
      promise.reject("FINISH_OVERLAY_ERROR", "Failed to finish overlay", e)
    }
  }
}
