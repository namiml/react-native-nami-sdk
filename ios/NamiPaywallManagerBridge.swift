//
//  NamiPaywallManagerBridge.swift
//  RNNami
//
//  Created by macbook on 07.04.2023.
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPaywallManager)
class RNNamiPaywallManager: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
      return ["RegisterBuySKU"]
    }
    
    @objc(buySkuComplete:)
    func buySkuComplete(callback: @escaping RCTResponseSenderBlock) -> Void {
//        NamiPaywallManager.buySkuComplete
    }

    @objc(registerBuySkuHandler)
    func registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { buySkuHandler in
            let dictionary = NamiBridgeUtil.sku(toSKUDict: buySkuHandler)
            self.sendEvent(withName: "RegisterBuySKU", body: dictionary)
        }
    }
    
    @objc(dismiss:callback:)
    func dismiss(animated: Bool, callback: @escaping RCTResponseSenderBlock) {
        NamiPaywallManager.dismiss(animated: animated) {
            callback([])
        }
    }
    
    @objc(displayedViewController)
    func displayedViewController() {
        _ = NamiPaywallManager.displayedViewController()
    }
}
