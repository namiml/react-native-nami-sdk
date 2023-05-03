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
      return ["RegisterBuySKU", "BlockingPaywallClosed"]
    }

    @objc(buySkuComplete:)
    func buySkuComplete(callback _: @escaping RCTResponseSenderBlock) {
//        NamiPaywallManager.buySkuComplete
    }

    @objc(registerBuySkuHandler)
    func registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { sku in
            let dictionary = RNNamiPurchaseManager.skuToSKUDict(sku)
            self.sendEvent(withName: "RegisterBuySKU", body: dictionary)
        }
    }
    
    @objc(registerCloseHandler)
    func registerCloseHandler() {
        NamiPaywallManager.registerCloseHandler { viewContoler in
            let dictionary = NSDictionary(dictionary: ["blockingPaywallClosed": true].compactMapValues { $0 })
            self.sendEvent(withName: "BlockingPaywallClosed", body: dictionary)
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
