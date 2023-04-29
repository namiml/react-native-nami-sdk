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
    
    private func entitlementInToDictionary(_ entitlement: NamiEntitlement) -> NSDictionary {
        let activePurchasesDict: [NSDictionary] = entitlement.activePurchases.map { purchase in
            let dictionary = RNNamiPurchaseManager.purchaseToPurchaseDict(purchase)
            return dictionary
        }

        let purchasedSkusDict: [NSDictionary] = entitlement.purchasedSkus.map { sku in
            let dictionary = RNNamiPurchaseManager.skuToSKUDict(sku)
            return dictionary
        }
        let relatedSkusDict: [NSDictionary] = entitlement.relatedSkus.map { sku in
            let dictionary = RNNamiPurchaseManager.skuToSKUDict(sku)
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
        let dictionaries: [NSDictionary] = entitlements.map { entitlement in
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
            let dictionaries: [NSDictionary] = activeEntitlements.map { entitlement in
                let dictionary = self.entitlementInToDictionary(entitlement)
                return dictionary
            }
            self.sendEvent(withName: "EntitlementsChanged", body: dictionaries)
        }
    }
}
