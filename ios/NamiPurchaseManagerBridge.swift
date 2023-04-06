//
//  NamiPurchaseManagerBridge.swift
//  RNNami
//
//  Created by macbook on 06.04.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPurchaseManager)
class RNNamiPurchaseManager: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
      return ["RegisterBuySKU"]
    }
    
    @objc(buySkuComplete:)
    func buySkuComplete(callback: @escaping RCTResponseSenderBlock) -> Void {
//        NamiPurchaseManager.buySkuComplete()
    }
    
    @objc(registerBuySkuHandler)
    func registerBuySkuHandler() {

    }
}

