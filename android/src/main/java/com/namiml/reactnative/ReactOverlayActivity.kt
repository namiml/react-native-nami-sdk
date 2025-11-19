package com.namiml.reactnative

import android.os.Bundle
import com.facebook.react.ReactActivity

class ReactOverlayActivity : ReactActivity() {
  override fun getMainComponentName(): String = "NamiOverlayHost"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    overridePendingTransition(0, 0)

    // Register this activity with the bridge module
    NamiOverlayControlBridgeModule.currentOverlayActivity = this
  }

  override fun onBackPressed() {
    finish()
    overridePendingTransition(0, 0)
  }

  override fun onDestroy() {
    super.onDestroy()
    // Clear the reference when activity is destroyed
    if (NamiOverlayControlBridgeModule.currentOverlayActivity == this) {
      NamiOverlayControlBridgeModule.currentOverlayActivity = null
      // Also clear the presenting flag to prevent stuck states
      NamiOverlayControlBridgeModule.clearPresentingFlag()
    }
  }
}
