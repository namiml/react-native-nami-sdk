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
    
    @objc(isEntitlementActive:resolver:rejecter:)
    func isEntitlementActive(referenceId: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isEntitlementActive = NamiEntitlementManager.isEntitlementActive(referenceId)
        resolve(isEntitlementActive)
    }
    
    @objc(active:rejecter:)
    func active(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let entitlements = NamiEntitlementManager.active()
        let dictionaries = entitlements.map { entitlement in
            let dictionary = NamiBridgeUtil.entitlement(toEntitlementDict: entitlement)
            return NSDictionary(dictionary: dictionary!.compactMapValues { $0 })
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
                let dictionary = NamiBridgeUtil.entitlement(toEntitlementDict: entitlement)
                return NSDictionary(dictionary: dictionary!.compactMapValues { $0 })
            }
            self.sendEvent(withName: "EntitlementsChanged", body: dictionaries)
        }
    }
}
