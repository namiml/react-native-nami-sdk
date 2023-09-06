//
//  NamiCampaignManagerBridge.swift
//  RNNami
//
//  Copyright © 2023 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import os
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

    func isURL(string: String) -> Bool {
        if let url = URL(string: string), url.scheme != nil, url.host != nil {
            return true
        }
        return false
    }

    func handlePaywallAction(
        paywallEvent: NamiPaywallEvent
    ) {
        var actionString: String
        switch paywallEvent.action {
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
        case .purchase_pending:
            actionString = "PURCHASE_PENDING"
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
        case .toggle_change:
            actionString = "TOGGLE_CHANGE"
        case .page_change:
            actionString = "PAGE_CHANGE"
        case .slide_change:
            actionString = "SLIDE_CHANGE"
        default:
            actionString = "UNKNOWN"
        }
        let errorSting = paywallEvent.purchaseError?.localizedDescription

        let dictionaries = paywallEvent.purchases.map { purchase in RNNamiPurchaseManager.purchaseToPurchaseDict(purchase) }

        let payload: [String: Any?] = [
            "campaignId": paywallEvent.campaignId,
            "campaignName": paywallEvent.campaignName,
            "campaignType": paywallEvent.campaignType,
            "campaignLabel": paywallEvent.campaignLabel,
            "campaignUrl": paywallEvent.campaignUrl,
            "paywallId": paywallEvent.paywallId,
            "paywallName": paywallEvent.paywallName,
            "segmentId": paywallEvent.segmentId,
            "externalSegmentId": paywallEvent.externalSegmentId,
            "action": actionString,
            "skuId": paywallEvent.sku?.skuId,
            "purchaseError": errorSting,
            "purchases": dictionaries,
            "deeplinkUrl": paywallEvent.deeplinkUrl,
            "componentChangeId": paywallEvent.componentChange?.id,
            "componentChangeName": paywallEvent.componentChange?.name,
        ]

        RNNamiCampaignManager.shared?.sendEvent(withName: "ResultCampaign", body: payload)
    }

    func handleLaunch(callback: @escaping RCTResponseSenderBlock, success: Bool, error: Error?) {
        callback([success, error?._code as Any])
    }

    @objc(launch:withUrl:context:completion:paywallCompletion:)
    func launch(
        label: String?,
        withUrl: String?,
        context: NSDictionary?,
        callback: @escaping RCTResponseSenderBlock,
        paywallCallback _: @escaping RCTResponseSenderBlock
    ) {
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

        var launchMethod: (() -> Void)?

        if let urlString = withUrl, let urlObject = URL(string: urlString) {
            launchMethod = {
                NamiCampaignManager.launch(url: urlObject, context: paywallLaunchContext,
                                           launchHandler: { success, error in
                                               self.handleLaunch(
                                                   callback: callback,
                                                   success: success,
                                                   error: error
                                               )
                                           },
                                           paywallActionHandler: { paywallEvent in
                                               self.handlePaywallAction(paywallEvent: paywallEvent)
                                           })
            }
        } else if let label = label {
            launchMethod = {
                NamiCampaignManager.launch(label: label, context: paywallLaunchContext,
                                           launchHandler: { success, error in
                                               self.handleLaunch(
                                                   callback: callback,
                                                   success: success,
                                                   error: error
                                               )
                                           },
                                           paywallActionHandler: { paywallEvent in
                                               self.handlePaywallAction(paywallEvent: paywallEvent)
                                           })
            }
        } else {
            print("Neither URL nor label provided calling default launch.")
            launchMethod = {
                NamiCampaignManager.launch(context: paywallLaunchContext,
                                           launchHandler: { success, error in
                                               self.handleLaunch(
                                                   callback: callback,
                                                   success: success,
                                                   error: error
                                               )
                                           },
                                           paywallActionHandler: { paywallEvent in
                                               self.handlePaywallAction(paywallEvent: paywallEvent)
                                           })
            }
        }

        launchMethod?()
    }

    @objc(allCampaigns:rejecter:)
    func allCampaigns(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let campaigns = NamiCampaignManager.allCampaigns()
        let dictionaries = campaigns.map { campaign in self.campaignInToDictionary(campaign) }
        resolve(dictionaries)
    }

    @objc(isCampaignAvailable:resolver:rejecter:)
    func isCampaignAvailable(
        campaignSource: String?,
        resolve: @escaping RCTPromiseResolveBlock,
        reject _: @escaping RCTPromiseRejectBlock
    ) {
        var isCampaignAvailable: Bool
        if let source = campaignSource {
            if isURL(string: source), let url = URL(string: source) {
                print("campaignSource is a URL: \(source)")
                isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(url: url)
            } else {
                print("campaignSource is a string: \(source)")
                isCampaignAvailable = NamiCampaignManager.isCampaignAvailable(label: source)
            }
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
