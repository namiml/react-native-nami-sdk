//
//  NamiCampaignManagerBridge.swift
//  RNNami
//
//  Created by macbook on 27.03.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import NamiApple

@objc(RNNamiCampaignManager)
class RNNamiCampaignManager: NSObject {
    
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
    
    @objc(launch:completion:)
    func launch(label: String?, callback: @escaping RCTResponseSenderBlock) -> Void {
        NamiCampaignManager.launch(label: label, launchHandler: { success, error in
            callback([success, error?._code as Any])
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
        if let label {
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

    @objc(registerAvailableCampaignsHandler:)
    func registerForAvailableCampaigns(callback: @escaping RCTResponseSenderBlock) {
        NamiCampaignManager.registerAvailableCampaignsHandler { availableCampaigns in
            let dictionaries = availableCampaigns.map { campaign in self.campaignInToDictionary(campaign) }
            callback([dictionaries])
        }
    }
}

