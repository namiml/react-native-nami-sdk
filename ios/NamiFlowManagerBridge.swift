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
            let payload: [String: Any] = [
                "handoffTag": tag,
                "handoffData": data ?? "",
            ]
            print("handoff native \(tag) \(data)")
            RNNamiFlowManager.shared?.sendEvent(withName: "RegisterStepHandoff", body: payload)
        }
    }

    @objc func resume() {
        NamiFlowManager.resume()
    }
}
