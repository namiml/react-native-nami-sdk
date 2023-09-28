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
import com.facebook.react.bridge.Promise
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLanguageCode
import com.namiml.NamiLogLevel
// import com.namiml.NamiApiResponseHandler

class NamiBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val CONFIG_MAP_PLATFORM_ID_KEY = "appPlatformID-android"
        private const val CONFIG_MAP_LOG_LEVEL_KEY = "logLevel"
        private const val CONFIG_MAP_DEVELOPMENT_MODE_KEY = "developmentMode"
        private const val CONFIG_MAP_BYPASS_STORE_KEY = "bypassStore"
        private const val CONFIG_MAP_NAMI_COMMANDS_KEY = "namiCommands"
        private const val CONFIG_MAP_LANGUAGE_CODE_KEY = "namiLanguageCode"
        private const val CONFIG_MAP_INITIAL_CONFIG_KEY = "initialConfig"
        private const val PLATFORM_ID_ERROR_VALUE = "APPPLATFORMID_NOT_FOUND"
    }

    override fun getName(): String {
        return "NamiBridge"
    }

    @ReactMethod
    fun configure(configDict: ReadableMap, completion: Callback) {
        // Need to be sure we have some valid string.
        val appPlatformID: String = if (configDict.hasKey(CONFIG_MAP_PLATFORM_ID_KEY)) {
            configDict.getString(CONFIG_MAP_PLATFORM_ID_KEY) ?: PLATFORM_ID_ERROR_VALUE
        } else {
            PLATFORM_ID_ERROR_VALUE
        }

        val appContext: Context = reactApplicationContext.applicationContext
        Log.d(LOG_TAG, "NAMI: RN Bridge - Configure called with appPlatformID $appPlatformID")

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
        Log.d(LOG_TAG, "NAMI: RN Bridge - configuration log level is $logLevelString")

        val developmentMode = if (configDict.hasKey(CONFIG_MAP_DEVELOPMENT_MODE_KEY)) {
            configDict.getBoolean(CONFIG_MAP_DEVELOPMENT_MODE_KEY)
        } else {
            false
        }
        if (developmentMode) {
                    Log.d(LOG_TAG, "NAMI: RN Bridge - development mode is $developmentMode")
            builder.developmentMode = true
        }

        val languageCode = if (configDict.hasKey(CONFIG_MAP_LANGUAGE_CODE_KEY)) {
            configDict.getString(CONFIG_MAP_LANGUAGE_CODE_KEY)
        } else {
            null
        }
        languageCode?.let { code ->
            NamiLanguageCode.values().find { it.code == code }.let { namiLanguageCode ->
                if (namiLanguageCode == null) {
                    Log.w(
                        LOG_TAG,
                        "Nami language code from config dictionary \"$code\" not " +
                            "found in list of available Nami Language Codes:\n",
                    )
                } else {
                    builder.namiLanguageCode = namiLanguageCode
                }
            }
        }

        val namiCommandsReact: ReadableArray? =
            if (configDict.hasKey(CONFIG_MAP_NAMI_COMMANDS_KEY)) {
                configDict.getArray(CONFIG_MAP_NAMI_COMMANDS_KEY)
            } else {
                Arguments.createArray()
            }
        val settingsList = mutableListOf("extendedClientInfo:react-native:3.1.12")
        namiCommandsReact?.toArrayList()?.filterIsInstance<String>()?.let { commandsFromReact ->
            settingsList.addAll(commandsFromReact)
        }
        Log.d(LOG_TAG, "Nami Configuration command settings are $settingsList")
        builder.settingsList = settingsList

        val initialConfig = if (configDict.hasKey(CONFIG_MAP_INITIAL_CONFIG_KEY)) {
            configDict.getString(CONFIG_MAP_INITIAL_CONFIG_KEY)
        } else {
            null
        }
        initialConfig?.let { initialConfigString ->
            Log.d(
                LOG_TAG,
                "Nami Configuration initialConfig found.",
            )
            builder.initialConfig = initialConfigString
        }

        val builtConfig: NamiConfiguration = builder.build()
        Log.d(LOG_TAG, "Nami Configuration object is $builtConfig")

        reactApplicationContext.runOnUiQueueThread {

            // Configure must be called on main thread
            Nami.configure(builtConfig) { result ->
                val resultMap = Arguments.createMap()
                resultMap.putBoolean("success", result)
                completion.invoke(resultMap)
            }
        }
    }
}
