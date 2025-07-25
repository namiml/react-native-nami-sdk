//
// NamiEntitlementManagerBridge.swift
// RNNami
//
// Copyright © 2023-2025 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import React

// #if RCT_NEW_ARCH_ENABLED
//     extension RNNamiEntitlementManager: RCTTurboModule {}
// #endif

@objc(RNNamiEntitlementManager)
class RNNamiEntitlementManager: RCTEventEmitter {
    public static var shared: RNNamiEntitlementManager?

    override init() {
        super.init()
        RNNamiEntitlementManager.shared = self
    }

    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func supportedEvents() -> [String]! {
        return ["EntitlementsChanged"]
    }

    private func entitlementToDictionary(_ entitlement: NamiEntitlement) -> NSDictionary {
        let activePurchases = entitlement.activePurchases.map {
            RNNamiPurchaseManager.purchaseToPurchaseDict($0)
        }

        let purchasedSkus = entitlement.purchasedSkus.map {
            RNNamiPurchaseManager.skuToSKUDict($0)
        }

        let relatedSkus = entitlement.relatedSkus.map {
            RNNamiPurchaseManager.skuToSKUDict($0)
        }

        let dictionary: [String: Any?] = [
            "name": entitlement.name ?? "",
            "desc": entitlement.desc ?? "",
            "referenceId": entitlement.referenceId,
            "activePurchases": activePurchases,
            "relatedSkus": relatedSkus,
            "purchasedSkus": purchasedSkus,
        ]

        return NSDictionary(dictionary: dictionary.compactMapValues { $0 })
    }

    @objc
    func isEntitlementActive(_ referenceId: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter _: @escaping RCTPromiseRejectBlock) {
        resolve(NamiEntitlementManager.isEntitlementActive(referenceId))
    }

    @objc
    func active(_ resolve: @escaping RCTPromiseResolveBlock,
                rejecter _: @escaping RCTPromiseRejectBlock)
    {
        let entitlements = NamiEntitlementManager.active().map {
            self.entitlementToDictionary($0)
        }
        resolve(entitlements)
    }

    @objc
    func refresh() {
        NamiEntitlementManager.refresh { entitlements in
            let dicts = entitlements.map { self.entitlementToDictionary($0) }
            DispatchQueue.main.async {
                RNNamiEntitlementManager.shared?.sendEvent(withName: "EntitlementsChanged", body: dicts)
            }
        }
    }

    @objc
    func registerActiveEntitlementsHandler() {
        NamiEntitlementManager.registerActiveEntitlementsHandler { entitlements in
            let dicts = entitlements.map { self.entitlementToDictionary($0) }
            DispatchQueue.main.async {
                RNNamiEntitlementManager.shared?.sendEvent(withName: "EntitlementsChanged", body: dicts)
            }
        }
    }

    @objc
    func clearProvisionalEntitlementGrants() {}
}
