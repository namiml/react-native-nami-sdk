//
//  NamiCampaignManagerBridge.swift
//  RNNami
//
//  Copyright © 2023 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiCampaignManager)
class RNNamiCampaignManager: RCTEventEmitter {
    public static var shared: RNNamiCampaignManager?

    override init() {
        super.init()
        RNNamiCampaignManager.shared = self
    }

    override func supportedEvents() -> [String]! {
        return ["AvailableCampaignsChanged", "ResultCampaign"]
    }

    private func campaignInToDictionary(_ campaign: NamiCampaign) -> NSDictionary {
        let dictionary: [String: Any?] = [
            "id": campaign.id,
            "rule": campaign.rule,
            "segment": campaign.segment,
            "paywall": campaign.paywall,
            "type": campaign.type.rawValue,
            "value": campaign.value,
        ]
        return NSDictionary(dictionary: dictionary.compactMapValues { $0 })
    }

    @objc(launch:context:completion:paywallCompletion:)
    func launch(label: String?, context: NSDictionary?, callback: @escaping RCTResponseSenderBlock, paywallCallback _: @escaping RCTResponseSenderBlock) {
        var paywallLaunchContext: PaywallLaunchContext?

        var productGroups: [String]?
        var customAttributes: [String: Any]?
        if let context = context {
            if let contextProductGroups = context["productGroups"] as? [String] {
                productGroups = contextProductGroups
            }
            if let contextCustomAttributes = context["customAttributes"] as? [String: Any] {
                customAttributes = contextCustomAttributes
            }
        }

        if productGroups != nil || customAttributes != nil {
            paywallLaunchContext = PaywallLaunchContext(productGroups: productGroups, customAttributes: customAttributes)
        }

        NamiCampaignManager.launch(label: label, context: paywallLaunchContext, launchHandler: { success, error in
            callback([success, error?._code as Any])
        }, paywallActionHandler: { campaignId, campaignName, campaignType, campaignLabel, campaignUrl, paywallId, paywallName, segmentId, externalSegmentId, paywallLaunchContext, action, sku, purchaseError, purchases, deeplinkUrl in
            let actionString: String
            switch action {
            case .show_paywall:
                actionString = "SHOW_PAYWALL"
            case .close_paywall:
                actionString = "CLOSE_PAYWALL"
            case .restore_purchases:
                actionString = "RESTORE_PURCHASES"
            case .sign_in:
                actionString = "SIGN_IN"
            case .buy_sku:
                actionString = "BUY_SKU"
            case .select_sku:
                actionString = "SELECT_SKU"
            case .purchase_selected_sku:
                actionString = "PURCHASE_SELECTED_SKU"
            case .purchase_success:
                actionString = "PURCHASE_SUCCESS"
            case .purchase_deferred:
                actionString = "PURCHASE_DEFERRED"
            case .purchase_failed:
                actionString = "PURCHASE_FAILED"
            case .purchase_cancelled:
                actionString = "PURCHASE_CANCELLED"
            case .purchase_unknown:
                actionString = "PURCHASE_UNKNOWN"
            case .deeplink:
                actionString = "DEEPLINK"
            @unknown default:
                actionString = "PURCHASE_UNKNOWN"
            }
            let skuId = sku?.skuId
            let errorSting = purchaseError?.localizedDescription

            let dictionaries = purchases.map { purchase in RNNamiPurchaseManager.purchaseToPurchaseDict(purchase) }
            let payload: [String: Any?] = [
                "campaignId": campaignId,
                "campaignLabel": campaignLabel,
                "paywallId": paywallId,
                "action": actionString,
                "skuId": skuId,
                "purchaseError": errorSting,
                "purchases": dictionaries,
            ]
            RNNamiCampaignManager.shared?.sendEvent(withName: "ResultCampaign", body: payload)
        })
    }

    @objc(allCampaigns:rejecter:)
    func allCampaigns(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let campaigns = NamiCampaignManager.allCampaigns()
        let dictionaries = campaigns.map { campaign in self.campaignInToDictionary(campaign) }
        resolve(dictionaries)
    }

    @objc(isCampaignAvailable:resolver:rejecter:)
    func isCampaignAvailable(label: String?, resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let isCampaignAvailable: Bool
        if let label = label {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(label: label)
        } else {
            isCampaignAvailable = NamiCampaignManager.isCampaignAvailable()
        }
        resolve(isCampaignAvailable)
    }

    @objc(refresh)
    func refresh() {
        NamiCampaignManager.refresh()
    }

    @objc(registerAvailableCampaignsHandler)
    func registerForAvailableCampaigns() {
        NamiCampaignManager.registerAvailableCampaignsHandler { availableCampaigns in
            let dictionaries = availableCampaigns.map { campaign in self.campaignInToDictionary(campaign) }
            RNNamiCampaignManager.shared?.sendEvent(withName: "AvailableCampaignsChanged", body: dictionaries)
        }
    }
}
