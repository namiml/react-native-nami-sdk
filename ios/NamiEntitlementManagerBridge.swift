//
//  NamiEntitlementManagerBridge.swift
//  RNNami
//
//  Created by macbook on 05.04.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiEntitlementManager)
class RNNamiEntitlementManager: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
      return ["EntitlementsChanged"]
    }
    
    private func productToDict(_ product: SKProduct) -> NSDictionary {
        let productDict : [String: Any?] = [
            "localizedTitle" : product.localizedTitle,
            "localizedDescription" : product.localizedDescription,
            "localizedPrice" : product.localizedPrice,
            "localizedMultipliedPrice" : product.localizedMultipliedPrice,
            "price" : product.price.stringValue,
            "priceLanguage" : product.priceLocale.languageCode,
            "priceCurrency" : product.priceLocale.currencyCode,
        ]
        return NSDictionary(dictionary: productDict.compactMapValues { $0 })
    }
    
    private func skuToSKUDict(_ sku: NamiSKU) -> NSDictionary {
        var productDict: NSDictionary?
        if let product = sku.product {
               productDict = self.productToDict(product)
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

        let skuDict : [String: Any?] = [
            "name": sku.name,
            "skuId": sku.skuId,
            "type": typeString,
            "product": productDict,
            "displayText": sku.localizedDisplayText,
            "displaySubText": sku.localizedSubDisplayText,
        ]

        return NSDictionary(dictionary: skuDict.compactMapValues { $0 })
    }
    
    private func purchaseToPurchaseDict(_ purchase: NamiPurchase) -> NSDictionary {
        let purchaseDict: [String: Any?] = [
            "skuIdentifier" : purchase.skuId,
            "transactionIdentifier" : purchase.transactionIdentifier,
            "purchaseSource" : "UNKNOWN",
        ]
        return NSDictionary(dictionary: purchaseDict.compactMapValues { $0 })
    }
    
    private func entitlementInToDictionary(_ entitlement: NamiEntitlement) -> NSDictionary {
        let activePurchasesDict = entitlement.activePurchases.map { purchase in
            let dictionary = self.purchaseToPurchaseDict(purchase)
            return dictionary
        }
        let purchasedSkusDict = entitlement.purchasedSkus.map { sku in
            let dictionary = self.skuToSKUDict(sku)
            return dictionary
        }
        let relatedSkusDict = entitlement.relatedSkus.map { sku in
            let dictionary = self.skuToSKUDict(sku)
            return dictionary
        }
        let dictionary: [String: Any?] = [
            "name": entitlement.name,
            "desc": entitlement.desc,
            "namiId": entitlement.namiId,
            "referenceId": entitlement.referenceId,
            "activePurchases": activePurchasesDict,
            "relatedSkus": relatedSkusDict,
            "purchasedSkus": purchasedSkusDict,
        ]
        return NSDictionary(dictionary: dictionary.compactMapValues { $0 })
    }
    
    @objc(isEntitlementActive:resolver:rejecter:)
    func isEntitlementActive(referenceId: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isEntitlementActive = NamiEntitlementManager.isEntitlementActive(referenceId)
        resolve(isEntitlementActive)
    }
    
    @objc(active:rejecter:)
    func active(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let entitlements = NamiEntitlementManager.active()
        let dictionaries = entitlements.map { entitlement in
            let dictionary = self.entitlementInToDictionary(entitlement)
            return dictionary
        }
        resolve(dictionaries)
    }
    
    @objc(refresh)
    func refresh() -> Void {
        NamiEntitlementManager.refresh()
    }

    @objc(registerActiveEntitlementsHandler)
    func registerActiveEntitlementsHandler() {
        NamiEntitlementManager.registerActiveEntitlementsHandler { activeEntitlements in
            let dictionaries = activeEntitlements.map { entitlement in
                let dictionary = self.entitlementInToDictionary(entitlement)
                return dictionary
            }
            self.sendEvent(withName: "EntitlementsChanged", body: dictionaries)
        }
    }
}
