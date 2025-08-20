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
    }

    override class func requiresMainQueueSetup() -> Bool { true }

    private var hasListeners = false
    override func startObserving() { hasListeners = true }
    override func stopObserving() { hasListeners = false }

    private func safeSend(withName name: String, body: Any?) {
        guard hasListeners else {
            print("[RNNamiFlowManager] Warning: no listeners, so event not being sent to JS.")
            return
        }
        sendEvent(withName: name, body: body)
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

            self.safeSend(withName: "Handoff", body: payload)
        }
    }

    @objc func registerEventHandler() {
        NamiFlowManager.registerEventHandler { payload in
            self.safeSend(withName: "FlowEvent", body: payload)
        }
    }

    @objc func resume() {
        NamiFlowManager.resume()
    }

    @objc func pause() {
        NamiFlowManager.pause()
    }

    @objc func finish() {
        NamiFlowManager.finish()
    }

    @objc func isFlowOpen(_ resolve: @escaping RCTPromiseResolveBlock, rejecter _: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let isFlowOpen = NamiFlowManager.isFlowOpen()
            resolve(isFlowOpen)
        }
    }

    @objc func purchaseSuccess() {
        // NamiFlowManager.purchaseSuccess()
    }
}
