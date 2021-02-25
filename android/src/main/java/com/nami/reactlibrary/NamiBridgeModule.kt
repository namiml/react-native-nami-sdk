package com.nami.reactlibrary

import android.app.Application
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableNativeArray
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiExternalIdentifierType
import com.namiml.NamiLogLevel

class NamiBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val CONFIG_MAP_PLATFORM_ID_KEY = "appPlatformID-google"
        private const val CONFIG_MAP_LOG_LEVEL_KEY = "logLevel"
        private const val CONFIG_MAP_DEVELOPMENT_MODE_KEY = "developmentMode"
        private const val CONFIG_MAP_BYPASS_STORE_KEY = "bypassStore"
        private const val CONFIG_MAP_NAMI_COMMANDS_KEY = "namiCommands"
        private const val PLATFORM_ID_ERROR_VALUE = "APPPLATFORMID_NOT_FOUND"
    }

    override fun getName(): String {
        return "NamiBridge"
    }

//    @ReactMethod
//    public void sampleMethod(String stringArgument, int numberArgument, Callback callback) {
//        // TODO: Implement some actually useful functionality
//        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
//    }

    @ReactMethod
    fun configure(configDict: ReadableMap) {

        // Need to be sure we have some valid string.
        val appPlatformID: String = if (configDict.hasKey(CONFIG_MAP_PLATFORM_ID_KEY)) {
            configDict.getString(CONFIG_MAP_PLATFORM_ID_KEY) ?: PLATFORM_ID_ERROR_VALUE
        } else {
            PLATFORM_ID_ERROR_VALUE
        }

        val appContext: Context = reactApplicationContext.applicationContext
        Log.i(LOG_TAG, "Configure called with appID $appPlatformID")
        Log.i(LOG_TAG, "Configure called with context $reactApplicationContext")
        Log.i(LOG_TAG, "Nami Configure called with context.applicationContext $appContext")

        val isApplication: Boolean = (appContext is Application)
        Log.i(LOG_TAG, "Configure called with (context as Application) $isApplication.")
        Log.i(LOG_TAG, "End Application check ")

        //Application fred = (reactContext as Application);

        val builder: NamiConfiguration.Builder =
            NamiConfiguration.Builder(appContext, appPlatformID)

        // React native will crash if you request a key from a map that does not exist, so always check key first
        val logLevelString = if (configDict.hasKey(CONFIG_MAP_LOG_LEVEL_KEY)) {
            configDict.getString(CONFIG_MAP_LOG_LEVEL_KEY)
        } else {
            ""
        }
        when (logLevelString) {
            "INFO" -> {
                builder.logLevel(NamiLogLevel.INFO)
            }
            "WARN" -> {
                builder.logLevel(NamiLogLevel.WARN)
            }
            "ERROR" -> {
                builder.logLevel(NamiLogLevel.ERROR)
            }
            else -> {
                // Any other parameters, just turn on full debugging so they can see everything.
                builder.logLevel(NamiLogLevel.DEBUG)
            }
        }
        Log.i(LOG_TAG, "Nami Configuration log level passed in is $logLevelString")

        val developmentMode = if (configDict.hasKey(CONFIG_MAP_DEVELOPMENT_MODE_KEY)) {
            configDict.getBoolean(CONFIG_MAP_DEVELOPMENT_MODE_KEY)
        } else {
            false
        }
        Log.i(LOG_TAG, "Nami Configuration developmentMode is $developmentMode")
        if (developmentMode) {
            builder.developmentMode = true
        }

        val bypassStoreMode = if (configDict.hasKey(CONFIG_MAP_BYPASS_STORE_KEY)) {
            configDict.getBoolean(CONFIG_MAP_BYPASS_STORE_KEY)
        } else {
            false
        }
        Log.i(LOG_TAG, "Nami Configuration bypassStoreMode is $bypassStoreMode")
        if (bypassStoreMode) {
            builder.bypassStore = true
        }

        val namiCommandsReact: ReadableArray? =
            if (configDict.hasKey(CONFIG_MAP_NAMI_COMMANDS_KEY)) {
                configDict.getArray(CONFIG_MAP_NAMI_COMMANDS_KEY)
            } else {
                Arguments.createArray()
            }
        val settingsList = mutableListOf("extendedClientInfo:react-native:0.3.1")
        namiCommandsReact?.toArrayList()?.filterIsInstance<String>()?.let { commandsFromReact ->
            settingsList.addAll(commandsFromReact)
        }
        Log.i(LOG_TAG, "Nami Configuration command settings are $settingsList")
        builder.settingsList = settingsList

        val builtConfig: NamiConfiguration = builder.build()
        Log.i(LOG_TAG, "Nami Configuration object is $builtConfig")

        reactApplicationContext.runOnUiQueueThread {
            // Configure must be called on main thread
            Nami.configure(builtConfig)
        }
    }

    @ReactMethod
    fun setExternalIdentifier(externalIdentifier: String, externalIDType: String) {

        Log.i(LOG_TAG, "Setting external identifier $externalIdentifier of type $externalIDType")

        val useType: NamiExternalIdentifierType = if (externalIDType == "sha256") {
            NamiExternalIdentifierType.SHA_256
        } else {
            NamiExternalIdentifierType.UUID
        }

        reactApplicationContext.runOnUiQueueThread {
            Nami.setExternalIdentifier(externalIdentifier, useType)
        }
    }

    @ReactMethod
    fun getExternalIdentifier(successCallback: Callback) {
        reactApplicationContext.runOnUiQueueThread {
            val externalIdentifierResult: WritableArray = WritableNativeArray()
            Nami.getExternalIdentifier()?.let { externalIdentifier ->
                Log.i(LOG_TAG, "getting external identifier, found $externalIdentifier")
                externalIdentifierResult.pushString(externalIdentifier)
            }
            successCallback.invoke(externalIdentifierResult)
        }
    }

    @ReactMethod
    fun clearExternalIdentifier() {
        Log.i(LOG_TAG, "Clearing external identifier.")
        reactApplicationContext.runOnUiQueueThread {
            Nami.clearExternalIdentifier()
        }
    }
}
