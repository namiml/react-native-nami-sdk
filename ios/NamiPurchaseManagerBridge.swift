//
//  NamiPurchaseManagerBridge.swift
//  RNNami
//
//  Copyright © 2023 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPurchaseManager)
class RNNamiPurchaseManager: RCTEventEmitter {
    
    public static var shared:RNNamiPurchaseManager?
    
    override init() {
        super.init()
        RNNamiPurchaseManager.shared = self
    }
    
    override func supportedEvents() -> [String]! {
        return ["PurchasesChanged", "RestorePurchasesStateChanged"]
    }

    static func productToDict(_ product: SKProduct) -> NSDictionary {
        let productDict: [String: Any?] = [
            "localizedTitle": product.localizedTitle,
            "localizedDescription": product.localizedDescription,
            "localizedPrice": product.localizedPrice,
            "localizedMultipliedPrice": product.localizedMultipliedPrice,
            "price": product.price.stringValue,
            "priceLanguage": product.priceLocale.languageCode,
            "priceCurrency": product.priceLocale.currencyCode,
        ]
        return NSDictionary(dictionary: productDict.compactMapValues { $0 })
    }

    static func skuToSKUDict(_ sku: NamiSKU) -> NSDictionary {
        var productDict: NSDictionary?
        if let product = sku.product {
            productDict = productToDict(product)
        }

        let typeString: String
        switch sku.type {
        case .unknown:
            typeString = "unknown"
        case .one_time_purchase:
            typeString = "one_time_purchase"
        case .subscription:
            typeString = "subscription"
        @unknown default:
            typeString = "unknown"
        }

        let skuDict: [String: Any?] = [
            "id": sku.id,
            "skuId": sku.skuId,
            "type": typeString,
            "appleProduct": productDict,
        ]

        return NSDictionary(dictionary: skuDict.compactMapValues { $0 })
    }

    static func purchaseToPurchaseDict(_ purchase: NamiPurchase) -> NSDictionary {
        var skuDictionary: NSDictionary?
        if let sku = purchase.sku {
            skuDictionary = RNNamiPurchaseManager.skuToSKUDict(sku)
        }
        let dateFormatter = DateFormatter()
        dateFormatter.locale = .init(identifier: "en_US_POSIX")
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        let expiresString = dateFormatter.string(from: purchase.expires ?? Date())
        let purchaseInitiatedString = dateFormatter.string(from: purchase.purchaseInitiatedTimestamp)

        let purchaseDict: [String: Any?] = [
            "skuId": purchase.skuId,
            "transactionIdentifier": purchase.transactionIdentifier,
            "sku": skuDictionary,
            "expires": expiresString,
            "purchaseInitiatedTimestamp": purchaseInitiatedString,
        ]
        return NSDictionary(dictionary: purchaseDict.compactMapValues { $0 })
    }

    @objc(allPurchases:rejecter:)
    func allPurchases(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let allPurchases = NamiPurchaseManager.allPurchases()
        let purchaseDictionaries = allPurchases.map { purchase in
            RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
        }
        resolve(purchaseDictionaries)
    }

    @objc(skuPurchased:resolver:rejecter:)
    func skuPurchased(skuId: String, resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let isSkuPurchased = NamiPurchaseManager.skuPurchased(skuId)
        resolve(isSkuPurchased)
    }

    @objc(anySkuPurchased:resolver:rejecter:)
    func anySkuPurchased(skuIds: [String], resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let isSkusPurchased = NamiPurchaseManager.anySkuPurchased(skuIds)
        resolve(isSkusPurchased)
    }

    @objc(consumePurchasedSku:)
    func consumePurchasedSku(skuId: String) {
        NamiPurchaseManager.consumePurchasedSku(skuId: skuId)
    }

    @objc(registerPurchasesChangedHandler)
    func registerPurchasesChangedHandler() {
        NamiPurchaseManager.registerPurchasesChangedHandler { purchases, purchaseState, error in
            let purchaseDictionaries = purchases.map { purchase in
                RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            }
            let stateString: String
            switch purchaseState {
            case .pending:
                stateString = "pending"
            case .purchased:
                stateString = "purchased"
            case .consumed:
                stateString = "consumed"
            case .resubscribed:
                stateString = "resubscribed"
            case .unsubscribed:
                stateString = "unsubscribed"
            case .deferred:
                stateString = "deferred"
            case .failed:
                stateString = "failed"
            case .cancelled:
                stateString = "cancelled"
            case .unknown:
                stateString = "unknown"
            @unknown default:
                stateString = "unknown"
            }

            let payload: [String: Any?] = [
                "purchases": purchaseDictionaries,
                "purchaseState": stateString,
                "error": error?.localizedDescription,
            ]
            self.sendEvent(withName: "PurchasesChanged", body: payload)
        }
    }

    @objc(registerRestorePurchasesHandler)
    func registerRestorePurchasesHandler() {
        NamiPurchaseManager.registerRestorePurchasesHandler { state, newPurchases, oldPurchases, _ in
            let stateString: String
            switch state {
            case .started:
                stateString = "started"
            case .finished:
                stateString = "finished"
            case .error:
                stateString = "error"
            @unknown default:
                stateString = "error"
            }
            let newPurchasesDictionaries = newPurchases.map { purchase in
                RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            }
            let oldPurchasesDictionaries = oldPurchases.map { purchase in
                RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            }
            let payload: [String: Any?] = [
                "state": stateString,
                "newPurchases": newPurchasesDictionaries,
                "oldPurchases": oldPurchasesDictionaries,
            ]
            RNNamiPurchaseManager.shared?.sendEvent(withName: "RestorePurchasesStateChanged", body: payload)
        }
    }

    @objc(restorePurchases)
    func restorePurchases() {
        NamiPurchaseManager.restorePurchases { state, newPurchases, oldPurchases, _ in
            let stateString: String
            switch state {
            case .started:
                stateString = "started"
            case .finished:
                stateString = "finished"
            case .error:
                stateString = "error"
            @unknown default:
                stateString = "error"
            }
            let newPurchasesDictionaries = newPurchases.map { purchase in
                RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            }
            let oldPurchasesDictionaries = oldPurchases.map { purchase in
                RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            }
            let payload: [String: Any?] = [
                "state": stateString,
                "newPurchases": newPurchasesDictionaries,
                "oldPurchases": oldPurchasesDictionaries,
            ]
            RNNamiPurchaseManager.shared?.sendEvent(withName: "RestorePurchasesStateChanged", body: payload)
        }
    }

    @objc(presentCodeRedemptionSheet)
    func presentCodeRedemptionSheet() {
        NamiPurchaseManager.presentCodeRedemptionSheet()
    }
}
