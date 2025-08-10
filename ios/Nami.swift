//
//  Nami.swift
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//
import Foundation
import NamiApple
import React

#if RCT_NEW_ARCH_ENABLED
    extension RNNami: RCTTurboModule {}
#endif

@objc(RNNami)
class RNNami: NSObject {
    static func moduleName() -> String! {
        return "RNNami"
    }

    @objc
    func configure(
        _ configDict: NSDictionary,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let appID = configDict["appPlatformID"] as? String, !appID.isEmpty else {
            reject("missing_app_id", "The appPlatformID is required.", nil)
            return
        }

        let config = NamiConfiguration(appPlatformId: appID)
        NSLog("RNNami: Configure with appPlatformId: %@", appID)

        if isNewArchitectureEnabled() {
            NSLog("RNNami: New Architecture is ENABLED")
        } else {
            NSLog("RNNami: New Architecture is DISABLED")
        }

        if let logLevelString = configDict["logLevel"] as? String {
            config.logLevel = {
                switch logLevelString.uppercased() {
                case "ERROR": return .error
                case "INFO": return .info
                case "WARNING": return .warn
                default: return .debug
                }
            }()
        }

        if let languageCode = configDict["namiLanguageCode"] as? String,
           NamiLanguageCodes.allAvailableNamiLanguageCodes.contains(where: { $0.caseInsensitiveCompare(languageCode) == .orderedSame })
        {
            config.namiLanguageCode = languageCode
        }

        if let commands = configDict["namiCommands"] as? [String] {
            config.namiCommands = commands
        }

        if let initialConfig = configDict["initialConfig"] as? String {
            config.initialConfig = initialConfig
        }

        var didCallBack = false
        Nami.configure(with: config) { sdkConfigured in
            didCallBack = true
            NSLog("RNNami: configure() completion called, sdkConfigured: \(sdkConfigured)")
            DispatchQueue.main.async {
                resolve(["success": sdkConfigured])
            }
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
            if !didCallBack {
                NSLog("RNNami: configure() completion NEVER CALLED, reporting failure.")
                resolve(["success": false])
            }
        }
    }

    @objc
    func sdkConfigured(_ resolve: @escaping RCTPromiseResolveBlock, rejecter _: RCTPromiseRejectBlock) {
        let sdkConfigured = Nami.sdkConfigured()
        DispatchQueue.main.async {
            resolve(sdkConfigured)
        }
    }

    @objc(sdkVersion:rejecter:)
    func sdkVersion(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let version = Nami.sdkVersion()
        DispatchQueue.main.async {
            resolve(version)
        }
    }

    func isNewArchitectureEnabled() -> Bool {
        #if RCT_NEW_ARCH_ENABLED
            return true
        #else
            return false
        #endif
    }
}
