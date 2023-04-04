//
//  NamiCustomerManager.swift
//  RNNami
//
//  Created by macbook on 31.03.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import NamiApple

@objc(RNNamiCustomerManager)
class RNNamiCustomerManager: NSObject {
    
    private func journeyStateToDictionary(_ journeyState: CustomerJourneyState) -> NSDictionary {
        let dictionary: [String: Any?] = [
            "formerSubscriber": journeyState.formerSubscriber,
            "inGracePeriod": journeyState.inGracePeriod,
            "inTrialPeriod": journeyState.inTrialPeriod,
            "inIntroOfferPeriod": journeyState.inIntroOfferPeriod,
            "isCancelled": journeyState.isCancelled,
            "inPause": journeyState.inPause,
            "inAccountHold": journeyState.inAccountHold,
        ]
        return NSDictionary(dictionary: dictionary.compactMapValues { $0 })
    }
    
    @objc(setCustomerAttribute:value:)
    func setCustomerAttribute(key: String, value: String) -> Void {
        NamiCustomerManager.setCustomerAttribute(key, value)
    }
    
    @objc(getCustomerAttribute:resolver:rejecter:)
    func getCustomerAttribute(key: String,resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let customerAttribute = NamiCustomerManager.getCustomerAttribute(key: key)
        resolve(customerAttribute)
    }
    
    @objc(clearCustomerAttribute:)
    func clearCustomerAttribute(key: String) -> Void {
        NamiCustomerManager.clearCustomerAttribute(key)
    }
    
    @objc(clearAllCustomerAttributes)
    func clearAllCustomerAttributes() -> Void {
        NamiCustomerManager.clearAllCustomerAttributes()
    }
    
    @objc(journeyState:rejecter:)
    func journeyState(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let journeyState = NamiCustomerManager.journeyState() {
            let dictionary = self.journeyStateToDictionary(journeyState)
            resolve(dictionary)
        } else {
            resolve(nil)
        }
    }
    
    @objc(isLoggedIn:rejecter:)
    func isLoggedIn(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let isLoggedIn = NamiCustomerManager.isLoggedIn()
        resolve(isLoggedIn)
    }
    
    @objc(loggedInId:rejecter:)
    func loggedInId(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let id = NamiCustomerManager.loggedInId()
        resolve(id)
    }
    
    @objc(deviceId:rejecter:)
    func deviceId(resolve: @escaping RCTPromiseResolveBlock,reject: @escaping RCTPromiseRejectBlock) -> Void {
        let id = NamiCustomerManager.deviceId()
        resolve(id)
    }
    
    @objc(login:completion:)
    func login(customerId: String, callback: @escaping RCTResponseSenderBlock) -> Void {
        NamiCustomerManager.login(withId: customerId, loginCompleteHandler: {success, error in
            callback([success, error?._code as Any])
        })
    }
    
    @objc(logout:)
    func logout(callback: @escaping RCTResponseSenderBlock) -> Void {
        NamiCustomerManager.logout(logoutCompleteHandler: {success, error in
            callback([success, error?._code as Any])
        })
    }
    
    @objc(registerJourneyStateHandler:)
    func registerJourneyStateHandler(callback: @escaping RCTResponseSenderBlock) {
        NamiCustomerManager.registerJourneyStateHandler { journeyState in
            let dictionary = self.journeyStateToDictionary(journeyState)
            callback([dictionary])
        }
    }
    
    @objc(registerAccountStateHandler:)
    func registerAccountStateHandler(callback: @escaping RCTResponseSenderBlock) {
        NamiCustomerManager.registerAccountStateHandler({action, success, error in
            callback([action.rawValue, success, error?._code as Any])
        })
    }
}
