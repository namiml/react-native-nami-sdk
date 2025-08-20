//
//  NamiPaywallManagerBridge.swift
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPaywallManager)
class RNNamiPaywallManager: RCTEventEmitter {
    public static var shared: RNNamiPaywallManager?

    override init() {
        super.init()
    }

    override class func requiresMainQueueSetup() -> Bool { true }

    private var hasListeners = false
    override func startObserving() { hasListeners = true }
    override func stopObserving() { hasListeners = false }

    private func safeSend(withName name: String, body: Any?) {
        guard hasListeners else {
            print("[RNNamiPaywallManager] Warning: no listeners, so event not being sent to JS.")
            return
        } // optional but avoids warnings
        sendEvent(withName: name, body: body)
    }

    override func supportedEvents() -> [String]! {
        return ["RegisterBuySKU", "PaywallCloseRequested", "PaywallSignInRequested", "PaywallRestoreRequested", "PaywallDeeplinkAction"]
    }

    @objc(buySkuComplete:)
    func buySkuComplete(dict: NSDictionary) {
        if let product = dict["product"] as? [String: Any] {
            if let storeId = product["skuId"] as? String,
               let namiId = product["id"] as? String,
               let skuType = product["type"] as? String
            {
                let namiSkuType: NamiSKUType
                switch skuType {
                case "unknown":
                    namiSkuType = .unknown
                case "one_time_purchase":
                    namiSkuType = .one_time_purchase
                case "subscription":
                    namiSkuType = .subscription
                default:
                    namiSkuType = .unknown
                }

                let namiSku = NamiSKU(namiId: namiId, storeId: storeId, skuType: namiSkuType)
                let priceString = dict["price"] as? String ?? "0"

                if let store = dict["storeType"] as? String, store != "Apple" {
                    print("RNNamiPaywallManager - buySkuComplete called with the wrong store type \(dict)")
                }

                do {
                    if let transactionID = dict["transactionID"] as? String,
                       let originalTransactionID = dict["originalTransactionID"] as? String,
                       let priceDecimal = Decimal(string: priceString),
                       let currencyCode = dict["currencyCode"] as? String
                    {
                        let purchaseSuccess = NamiPurchaseSuccess(
                            product: namiSku,
                            transactionID: transactionID,
                            originalTransactionID: originalTransactionID,
                            price: priceDecimal,
                            currencyCode: currencyCode
                        )
                        NamiPaywallManager.buySkuComplete(purchaseSuccess: purchaseSuccess)
                    } else {
                        print("RNNamiPaywallManager - buySkuComplete payload error \(dict)")
                    }
                } catch {
                    print("RNNamiPaywallManager - buySkuComplete error - decoding JSON: \(error)")
                }
            }
        }
    }

    @objc(registerBuySkuHandler)
    func registerBuySkuHandler() {
        NamiPaywallManager.registerBuySkuHandler { sku in
            let dictionary = RNNamiPurchaseManager.skuToSKUDict(sku)
            self.safeSend(withName: "RegisterBuySKU", body: dictionary)
        }
    }

    @objc(registerCloseHandler)
    func registerCloseHandler() {
        NamiPaywallManager.registerCloseHandler { _ in
            let dictionary = NSDictionary(dictionary: ["PaywallCloseRequested": true].compactMapValues { $0 })
            self.safeSend(withName: "PaywallCloseRequested", body: dictionary)
        }
    }

    @objc(registerSignInHandler)
    func registerSignInHandler() {
        NamiPaywallManager.registerSignInHandler { _ in
            let dictionary = NSDictionary(dictionary: ["PaywallSignInRequested": true].compactMapValues { $0 })
            self.safeSend(withName: "PaywallSignInRequested", body: dictionary)
        }
    }

    @objc(registerRestoreHandler)
    func registerRestoreHandler() {
        NamiPaywallManager.registerRestoreHandler {
            let dictionary = NSDictionary(dictionary: ["PaywallRestoreRequested": true].compactMapValues { $0 })
            self.safeSend(withName: "PaywallRestoreRequested", body: dictionary)
        }
    }

    @objc(registerDeeplinkActionHandler)
    func registerDeeplinkActionHandler() {
        NamiPaywallManager.registerDeeplinkActionHandler { url in
            self.safeSend(withName: "PaywallDeeplinkAction", body: url)
        }
    }

    @objc(dismiss:rejecter:)
    func dismiss(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            NamiPaywallManager.dismiss(animated: true) {
                resolve(true)
            }
        }
    }

    @objc(show)
    func show() {
        DispatchQueue.main.async {
            NamiPaywallManager.show()
        }
    }

    @objc(hide)
    func hide() {
        DispatchQueue.main.async {
            NamiPaywallManager.hide()
        }
    }

    @objc(buySkuCancel)
    func buySkuCancel() {
        DispatchQueue.main.async {
            NamiPaywallManager.buySkuCancel()
        }
    }

    @objc(isHidden:rejecter:)
    func isHidden(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let isHidden = NamiPaywallManager.isHidden()
            resolve(isHidden)
        }
    }

    @objc(isPaywallOpen:rejecter:)
    func isPaywallOpen(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let isPaywallOpen = NamiPaywallManager.isPaywallOpen()
            resolve(isPaywallOpen)
        }
    }

    @objc(setProductDetails:allowOffers:)
    func setProductDetails(productDetails _: String, allowOffers _: Bool) {
        // Do nothing on Apple
    }

    @objc(setAppSuppliedVideoDetails:name:)
    func setAppSuppliedVideoDetails(url: String, name: String?) {
        NamiPaywallManager.setAppSuppliedVideoDetails(url: url, name: name)
    }

    @objc(allowUserInteraction:)
    func allowUserInteraction(allowed: Bool) {
        DispatchQueue.main.async {
            NamiPaywallManager.allowUserInteraction(allowed)
        }
    }
}
