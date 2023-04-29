//
//  NamiCampaignManagerBridge.swift
//  RNNami
//
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiCampaignManager)
class RNNamiCampaignManager: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
      return ["AvailableCampaignsChanged"]
    }
    
    private func campaignInToDictionary(_ campaign: NamiCampaign) -> NSDictionary {
        let dictionary: [String: Any?] = [
            "id": campaign.id,
            "rule": campaign.rule,
            "segment": campaign.segment,
            "paywall": campaign.paywall,
            "type": campaign.type.rawValue,
            "value": campaign.value
        ]
        return NSDictionary(dictionary: dictionary.compactMapValues { $0 })
    }
    
    @objc(launch:completion:paywallCompletion:)
    func launch(label: String?, callback: @escaping RCTResponseSenderBlock, paywallCallback: @escaping RCTResponseSenderBlock) -> Void {
        NamiCampaignManager.launch(label: label, launchHandler: { success, error in
            callback([success, error?._code as Any])
        }, paywallActionHandler: { action, sku, purchaseError, purchases -> () in
            let actionString: String
            switch action {
            case .close_paywall:
                actionString = "NAMI_CLOSE_PAYWALL"
            case .restore_purchases:
                actionString = "NAMI_RESTORE_PURCHASES"
            case .sign_in:
                actionString = "NAMI_SIGN_IN"
            case .buy_sku:
                actionString = "NAMI_BUY_SKU"
            case .select_sku:
                actionString = "NAMI_SELECT_SKU"
            case .purchase_selected_sku:
                actionString = "NAMI_PURCHASE_SELECTED_SKU"
            case .purchase_success:
                actionString = "NAMI_PURCHASE_SUCCESS"
            case .purchase_deferred:
                actionString = "NAMI_PURCHASE_DEFERRED"
            case .purchase_failed:
                actionString = "NAMI_PURCHASE_FAILED"
            case .purchase_cancelled:
                actionString = "NAMI_PURCHASE_CANCELLED"
            case .purchase_unknown:
                actionString = "NAMI_PURCHASE_UNKNOWN"
            @unknown default:
                actionString = "NAMI_PURCHASE_UNKNOWN"
            }
            let skuId = sku?.skuId
            let errorSting = purchaseError?.localizedDescription
            let dictionaries = purchases.map { purchase in NamiBridgeUtil.purchase(toPurchaseDict: purchase) }
//            paywallCallback([actionString, skuId as Any, errorSting as Any, dictionaries])
        })
        
    }

    @objc(allCampaigns:rejecter:)
    func allCampaigns(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let campaigns = NamiCampaignManager.allCampaigns()
        let dictionaries = campaigns.map { campaign in self.campaignInToDictionary(campaign) }
        resolve(dictionaries)
    }

    @objc(isCampaignAvailable:resolver:rejecter:)
    func isCampaignAvailable(label: String?, resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isCampaignAvailable: Bool
        if let label = label {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(label: label)
        } else {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable()
        }
        resolve(isCampaignAvailable)
    }

    @objc(refresh)
    func refresh() -> Void {
        NamiCampaignManager.refresh()
    }

    @objc(registerAvailableCampaignsHandler)
    func registerForAvailableCampaigns() {
        NamiCampaignManager.registerAvailableCampaignsHandler { availableCampaigns in
            let dictionaries = availableCampaigns.map { campaign in self.campaignInToDictionary(campaign) }
            self.sendEvent(withName: "AvailableCampaignsChanged", body: dictionaries)
        }
    }
}

