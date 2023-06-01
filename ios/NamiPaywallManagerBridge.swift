//
//  NamiPaywallManagerBridge.swift
//  RNNami
//
//  Copyright © 2023 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPaywallManager)
class RNNamiPaywallManager: RCTEventEmitter {
    public static var shared: RNNamiPaywallManager?

    override init() {
        super.init()
        RNNamiPaywallManager.shared = self
    }

    override func supportedEvents() -> [String]! {
        return ["RegisterBuySKU", "PaywallCloseRequested"]
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

                do {
                    let dateFormatter = DateFormatter()
                    dateFormatter.locale = .init(identifier: "en_US_POSIX")
                    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"

                    if
                        let transactionID = dict["transactionID"] as? String,
                        let originalTransactionID = dict["originalTransactionID"] as? String,
                        let priceDecimal = Decimal(string: dict["price"] as! String),
                        let currencyCode = dict["currencyCode"] as? String,
                        let localeString = dict["locale"] as? String
                    {
                        let expiresDate = Date(timeIntervalSince1970: dict["purchaseDate"] as! Double? ?? 0)
                        let originalPurchaseDate = Date(timeIntervalSince1970: dict["originalPurchaseDate"] as! Double)
                        let purchaseDate = Date(timeIntervalSince1970: dict["purchaseDate"] as! Double)
                        let locale = Locale(identifier: localeString)
                        let purchaseSuccess = NamiPurchaseSuccess(
                            product: namiSku,
                            transactionID: transactionID,
                            originalTransactionID: originalTransactionID,
                            originalPurchaseDate: originalPurchaseDate,
                            purchaseDate: purchaseDate,
                            expiresDate: expiresDate,
                            price: priceDecimal,
                            currencyCode: currencyCode,
                            locale: locale
                        )
                        NamiPaywallManager.buySkuComplete(purchaseSuccess: purchaseSuccess)
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
            RNNamiPaywallManager.shared?.sendEvent(withName: "RegisterBuySKU", body: dictionary)
        }
    }

    @objc(registerCloseHandler)
    func registerCloseHandler() {
        NamiPaywallManager.registerCloseHandler { _ in
            let dictionary = NSDictionary(dictionary: ["PaywallCloseRequested": true].compactMapValues { $0 })
            RNNamiPaywallManager.shared?.sendEvent(withName: "PaywallCloseRequested", body: dictionary)
        }
    }

    @objc(dismiss:)
    func dismiss(animated: Bool) {
        NamiPaywallManager.dismiss(animated: animated) {}
    }
}
