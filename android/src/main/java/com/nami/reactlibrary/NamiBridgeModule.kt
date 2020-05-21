package com.nami.reactlibrary

import android.app.Application
import android.content.Context
import android.util.Log
import com.facebook.react.bridge.*
import com.namiml.*

class NamiBridgeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


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
        val appPlatformID: String = if (configDict.hasKey("appPlatformID-google")) configDict.getString("appPlatformID-google")
                ?: "APPPLATFORMID_NOT_FOUND" else "APPPLATFORMID_NOT_FOUND"

        val reactContext = reactApplicationContext
        Log.i("NamiBridge", "Configure called with appID " + appPlatformID)
        Log.i("NamiBridge", "Configure called with context " + reactContext)
        Log.i("NamiBridge", "Nami Configure called with context.applicationContext " + reactContext.getApplicationContext())

        val appContext: Context = reactContext.getApplicationContext()
        val isApplication: Boolean = (appContext is Application)
        Log.i("NamiBridge", "Configure called with (context as Application) " + isApplication + ".")
        Log.i("NamiBridge", "End Application check ");

        //Application fred = (reactContext as Application);


        val builder: NamiConfiguration.Builder = NamiConfiguration.Builder(appContext, appPlatformID)

        // React native will crash if you request a key from a map that does not exist, so always check key first
        val logLevelString = if (configDict.hasKey("logLevel")) configDict.getString("logLevel") else ""
        if (logLevelString == "INFO") {
            builder.logLevel(NamiLogLevel.INFO)
        } else if (logLevelString == "WARN") {
            builder.logLevel(NamiLogLevel.WARN)
        } else if (logLevelString == "ERROR") {
            builder.logLevel(NamiLogLevel.ERROR)
        } else {
            // Any other parameters, just turn on full debugging so they can see everything.
            builder.logLevel(NamiLogLevel.DEBUG)
        }
        Log.i("NamiBridge", "Nami Configuration log level passed in is is $logLevelString");


        val developmentMode = if (configDict.hasKey("developmentMode")) configDict.getBoolean("developmentMode") else false
        Log.i("NamiBridge", "Nami Configuration developmentMode is $developmentMode");
        if (developmentMode) {
            builder.developmentMode = true
        }

        val bypassStoreMode = if (configDict.hasKey("bypassStore")) configDict.getBoolean("bypassStore") else false
        Log.i("NamiBridge", "Nami Configuration bypassSotreMode is $bypassStoreMode");
        if (bypassStoreMode) {
            builder.bypassStoreMode = true
        }

        val builtConfig: NamiConfiguration = builder.build()
        Log.i("NamiBridge", "Nami Configuration object is $builtConfig");

        Nami.configure(builtConfig)
    }


    @ReactMethod
    fun setExternalIdentifier(externalIdentifier: String, externalIDType: String) {

        Log.i("NamiBridge", "Setting external identifier $externalIdentifier of type $externalIDType");

        val useType: NamiExternalIdentifierType
        if (externalIDType == "sha256") {
            useType = NamiExternalIdentifierType.SHA_256
        } else {
            useType = NamiExternalIdentifierType.UUID
        }

        Nami.setExternalIdentifier(externalIdentifier, useType)
    }

    @ReactMethod
    fun getExternalIdentifier(successCallback: Callback) {
        val externalIdentifierResult: WritableArray = WritableNativeArray()

        val externalIdentifier = Nami.getExternalIdentifier()
        externalIdentifier?.let {
            externalIdentifierResult.pushString(externalIdentifier)
        }

        Log.i("NamiBridge", "getting external identifier, found $externalIdentifier");

        successCallback.invoke(externalIdentifierResult)
    }

    @ReactMethod
    fun clearExternalIdentifier() {
        Log.i("NamiBridge", "Clearing external identifier.");
        Nami.clearExternalIdentifier()
    }


}
