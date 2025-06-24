package com.namiml.reactnative

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.turbomodule.core.interfaces.TurboModule
import com.namiml.Nami
import com.namiml.NamiConfiguration
import com.namiml.NamiLanguageCode
import com.namiml.NamiLogLevel

@ReactModule(name = NamiBridgeModule.NAME)
class NamiBridgeModule internal constructor(
    private val context: ReactApplicationContext
) : ReactContextBaseJavaModule(context), TurboModule {

    companion object {
        const val NAME = "RNNami"

        private const val CONFIG_MAP_PLATFORM_ID_KEY = "appPlatformID"
        private const val CONFIG_MAP_LOG_LEVEL_KEY = "logLevel"
        private const val CONFIG_MAP_DEVELOPMENT_MODE_KEY = "developmentMode"
        private const val CONFIG_MAP_NAMI_COMMANDS_KEY = "namiCommands"
        private const val CONFIG_MAP_LANGUAGE_CODE_KEY = "namiLanguageCode"
        private const val CONFIG_MAP_INITIAL_CONFIG_KEY = "initialConfig"

        private const val PLATFORM_ID_ERROR_VALUE = "APPPLATFORMID_NOT_FOUND"
    }

    override fun getName(): String = NAME

    @ReactMethod
    fun sdkConfigured(promise: Promise) {
        promise.resolve(Nami.isInitialized())
    }

    @ReactMethod
    fun configure(configDict: ReadableMap, promise: Promise) {
        val appPlatformID = configDict.getString(CONFIG_MAP_PLATFORM_ID_KEY) ?: PLATFORM_ID_ERROR_VALUE
        val builder = NamiConfiguration.Builder(context.applicationContext, appPlatformID)

        when (configDict.getString(CONFIG_MAP_LOG_LEVEL_KEY)) {
            "INFO" -> builder.logLevel(NamiLogLevel.INFO)
            "WARN" -> builder.logLevel(NamiLogLevel.WARN)
            "ERROR" -> builder.logLevel(NamiLogLevel.ERROR)
            else -> builder.logLevel(NamiLogLevel.DEBUG)
        }

        if (configDict.hasKey(CONFIG_MAP_DEVELOPMENT_MODE_KEY) &&
            configDict.getBoolean(CONFIG_MAP_DEVELOPMENT_MODE_KEY)) {
            builder.developmentMode = true
        }

        configDict.getString(CONFIG_MAP_LANGUAGE_CODE_KEY)?.let { code ->
            NamiLanguageCode.values().find { it.code == code }?.let {
                builder.namiLanguageCode = it
            }
        }

        configDict.getArray(CONFIG_MAP_NAMI_COMMANDS_KEY)?.let { commandsArray ->
            val settingsList = mutableListOf<String>()
            for (i in 0 until commandsArray.size()) {
                commandsArray.getString(i)?.let { settingsList.add(it) }
            }
            builder.settingsList = settingsList
        }

        configDict.getString(CONFIG_MAP_INITIAL_CONFIG_KEY)?.let {
            builder.initialConfig = it
        }

        context.runOnUiQueueThread {
            Nami.configure(builder.build()) { result ->
                val resultMap = Arguments.createMap().apply {
                    putBoolean("success", result)
                }
                promise.resolve(resultMap)
            }
        }
    }

    @ReactMethod fun addListener(eventName: String?) {}
    @ReactMethod fun removeListeners(count: Int?) {}
}
