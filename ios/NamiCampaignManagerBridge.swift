//
//  NamiCampaignManagerBridge.swift
//  RNNami
//
//  Copyright © 2020-2025 Nami ML Inc. All rights reserved.
//

import Foundation
import NamiApple
import os
import React

#if RCT_NEW_ARCH_ENABLED
    extension RNNamiCampaignManager: RCTTurboModule {}
#endif

@objc(RNNamiCampaignManager)
class RNNamiCampaignManager: RCTEventEmitter {
    public static var shared: RNNamiCampaignManager?

    override init() {
        super.init()
        RNNamiCampaignManager.shared = self
    }

    override func supportedEvents() -> [String]! {
        return ["AvailableCampaignsChanged", "NamiPaywallEvent"]
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

    private func mapPaywallActionToJS(_ action: NamiPaywallAction) -> String {
        switch action {
        case .show_paywall: return "SHOW_PAYWALL"
        case .close_paywall: return "CLOSE_PAYWALL"
        case .restore_purchases: return "RESTORE_PURCHASES"
        case .sign_in: return "SIGN_IN"
        case .buy_sku: return "BUY_SKU"
        case .select_sku: return "SELECT_SKU"
        case .purchase_selected_sku: return "PURCHASE_SELECTED_SKU"
        case .purchase_success: return "PURCHASE_SUCCESS"
        case .purchase_pending: return "PURCHASE_PENDING"
        case .purchase_deferred: return "PURCHASE_DEFERRED"
        case .purchase_failed: return "PURCHASE_FAILED"
        case .purchase_cancelled: return "PURCHASE_CANCELLED"
        case .purchase_unknown: return "PURCHASE_UNKNOWN"
        case .deeplink: return "DEEPLINK"
        case .toggle_change: return "TOGGLE_CHANGE"
        case .page_change: return "PAGE_CHANGE"
        case .slide_change: return "SLIDE_CHANGE"
        case .nami_collapsible_drawer_open: return "COLLAPSIBLE_DRAWER_OPEN"
        case .nami_collapsible_drawer_close: return "COLLAPSIBLE_DRAWER_CLOSE"
        case .video_play: return "VIDEO_STARTED"
        case .video_pause: return "VIDEO_PAUSED"
        case .video_resume: return "VIDEO_RESUMED"
        case .video_end: return "VIDEO_ENDED"
        case .video_change: return "VIDEO_CHANGED"
        case .video_mute: return "VIDEO_MUTED"
        case .video_unmute: return "VIDEO_UNMUTED"
        @unknown default:
            return "UNKNOWN"
        }
    }

    func handlePaywallAction(
        paywallEvent: NamiPaywallEvent
    ) {
        let actionString = mapPaywallActionToJS(paywallEvent.action)

        let errorSting = paywallEvent.purchaseError?.localizedDescription

        let dictionaries = paywallEvent.purchases.map { purchase in RNNamiPurchaseManager.purchaseToPurchaseDict(purchase) }

        var skuDict: [String: Any?] = [:]

        if let sku = paywallEvent.sku {
            skuDict["id"] = sku.id
            skuDict["name"] = sku.name
            skuDict["skuId"] = sku.skuId
            skuDict["type"] = sku.type.description
        }

        var componentChange: [String: Any?] = [:]

        if let eventComponentChange = paywallEvent.componentChange {
            componentChange["id"] = eventComponentChange.id
            componentChange["name"] = eventComponentChange.name
        }

        var videoMetadata: [String: Any?] = [:]

        if let eventVideoMetadata = paywallEvent.videoMetadata {
            videoMetadata["id"] = eventVideoMetadata.id
            videoMetadata["name"] = eventVideoMetadata.name
            videoMetadata["url"] = eventVideoMetadata.url
            videoMetadata["loopVideo"] = eventVideoMetadata.loopVideo
            videoMetadata["muteByDefault"] = eventVideoMetadata.muteByDefault
            videoMetadata["autoplayVideo"] = eventVideoMetadata.autoplayVideo
            videoMetadata["contentTimecode"] = eventVideoMetadata.contentTimecode
            videoMetadata["contentDuration"] = eventVideoMetadata.contentDuration
        }

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
            "sku": skuDict,
            "purchaseError": errorSting,
            "purchases": dictionaries,
            "deeplinkUrl": paywallEvent.deeplinkUrl,
            "componentChange": componentChange,
            "videoMetadata": videoMetadata,
            "timeSpentOnPaywall": paywallEvent.timeSpentOnPaywall,
        ]

        DispatchQueue.main.async {
            RNNamiCampaignManager.shared?.sendEvent(withName: "NamiPaywallEvent", body: payload)
        }
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
        var customObject: [String: Any]?

        if let context = context {
            if let contextProductGroups = context["productGroups"] as? [String] {
                productGroups = contextProductGroups
            }
            if let contextCustomAttributes = context["customAttributes"] as? [String: Any] {
                customAttributes = contextCustomAttributes
            }
            if let contextCustomObject = context["customObject"] as? [String: Any] {
                customObject = contextCustomObject
            }
        }

        if productGroups != nil || customAttributes != nil || customObject != nil {
            paywallLaunchContext = PaywallLaunchContext(productGroups: productGroups, customAttributes: customAttributes, customObject: customObject)
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
        DispatchQueue.main.async {
            launchMethod?()
        }
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
            isCampaignAvailable = false
        }
        resolve(isCampaignAvailable)
    }

    @objc(refresh:rejecter:)
    func refresh(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        NamiCampaignManager.refresh { campaigns in
            let dictionaries = campaigns.map { campaign in self.campaignInToDictionary(campaign) }
            resolve(dictionaries)
        }
    }

    @objc(registerAvailableCampaignsHandler)
    func registerForAvailableCampaigns() {
        NamiCampaignManager.registerAvailableCampaignsHandler { availableCampaigns in
            let dictionaries = availableCampaigns.map { campaign in self.campaignInToDictionary(campaign) }
            DispatchQueue.main.async {
                RNNamiCampaignManager.shared?.sendEvent(withName: "AvailableCampaignsChanged", body: dictionaries)
            }
        }
    }
}
