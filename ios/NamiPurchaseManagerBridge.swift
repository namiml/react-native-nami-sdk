//
//  NamiPurchaseManagerBridge.swift
//  RNNami
//
//  Created by macbook on 06.04.2023.
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiPurchaseManager)
class RNNamiPurchaseManager: NSObject {
    
    @objc(skuPurchased:resolver:rejecter:)
    func skuPurchased(skuId: String, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isSkuPurchased = NamiPurchaseManager.skuPurchased(skuId)
        resolve(isSkuPurchased)
    }
    
    @objc(anySkuPurchased:resolver:rejecter:)
    func anySkuPurchased(skuIds: [String], resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isSkusPurchased = NamiPurchaseManager.anySkuPurchased(skuIds)
        resolve(isSkusPurchased)
    }
    
    @objc(consumePurchasedSku:)
    func consumePurchasedSku(skuId: String) -> Void {
        NamiPurchaseManager.consumePurchasedSku(skuId: skuId)
    }
}

