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
    import React_RCTTurboModule

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
        NSLog("NAMI: RN Bridge - appPlatformId: %@", appID)

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

        Nami.configure(with: config) { sdkConfigured in
            resolve(["success": sdkConfigured])
        }
    }

    @objc
    func sdkConfigured(_ resolve: RCTPromiseResolveBlock, rejecter _: RCTPromiseRejectBlock) {
        resolve(Nami.sdkConfigured())
    }
}
