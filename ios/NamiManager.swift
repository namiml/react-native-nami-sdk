//
//  NamiManager.swift
//  RNNami
//
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiManager)
class RNNamiManager: RCTEventEmitter {
    public static var shared: RNNamiManager?

    override init() {
        super.init()
        RNNamiManager.shared = self
    }

    override func supportedEvents() -> [String]! {
        return []
    }

    @objc(sdkConfigured:rejecter:)
    func sdkConfigured(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let sdkConfigured = Nami.sdkConfigured()
        resolve(sdkConfigured)
    }
}
