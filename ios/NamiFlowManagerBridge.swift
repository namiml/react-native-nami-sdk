//
// NamiFlowManagerBridge.swift
// RNNami
//
// Copyright © 2025 Nami ML Inc.. All rights reserved.
//

import Foundation
import NamiApple
import React

#if RCT_NEW_ARCH_ENABLED
    extension RNNamiFlowManager: RCTTurboModule {}
#endif

@objc(RNNamiFlowManager)
class RNNamiFlowManager: RCTEventEmitter {
    public static var shared: RNNamiFlowManager?

    override init() {
        super.init()
        RNNamiFlowManager.shared = self
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func supportedEvents() -> [String]! {
        return ["Handoff", "FlowEvent"]
    }

    @objc func registerStepHandoff() {
        NamiFlowManager.registerStepHandoff { tag, data in
            var payload: [String: Any] = [
                "handoffTag": tag,
            ]
            if let data = data {
                payload["handoffData"] = data
            }

            DispatchQueue.main.async {
                RNNamiFlowManager.shared?.sendEvent(withName: "Handoff", body: payload)
            }
        }
    }

    @objc func registerEventHandler() {
        NamiFlowManager.registerEventHandler { payload in
            DispatchQueue.main.async {
                RNNamiFlowManager.shared?.sendEvent(withName: "FlowEvent", body: payload)
            }
        }
    }

    @objc func resume() {
        DispatchQueue.main.async {
            NamiFlowManager.resume()
        }
    }
}
