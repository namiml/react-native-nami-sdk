//
// NamiFlowManagerBridge.swift
// RNNami
//
// Copyright © 2025 Nami ML Inc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiFlowManager)
class RNNamiFlowManager: RCTEventEmitter {
    public static var shared: RNNamiFlowManager?

    override init() {
        super.init()
        RNNamiFlowManager.shared = self
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["RegisterStepHandoff"]
    }

    @objc func registerStepHandoff() {
        NamiFlowManager.registerStepHandoff { tag, data in
            var payload: [String: Any] = [
                "handoffTag": tag,
            ]
            if let data = data {
                payload["handoffData"] = data
            }
            RNNamiFlowManager.shared?.sendEvent(withName: "RegisterStepHandoff", body: payload)
        }
    }

    @objc(registerEventHandler:)
    func registerEventHandler(_ callback: @escaping RCTResponseSenderBlock) {
        NamiFlowManager.registerEventHandler { payload in
            callback([payload])
        }
    }

    @objc func resume() {
        DispatchQueue.main.async {
            NamiFlowManager.resume()
        }
    }
}
