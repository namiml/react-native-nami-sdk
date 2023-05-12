//
//  NamiCustomerManager.swift
//  RNNami
//
//  Copyright © 2023 Nami ML INc.. All rights reserved.
//

import Foundation
import NamiApple
import React

@objc(RNNamiCustomerManager)
class RNNamiCustomerManager: RCTEventEmitter {
    override func supportedEvents() -> [String]! {
        return ["JourneyStateChanged", "AccountStateChanged"]
    }

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
    func setCustomerAttribute(key: String, value: String) {
        NamiCustomerManager.setCustomerAttribute(key, value)
    }

    @objc(getCustomerAttribute:resolver:rejecter:)
    func getCustomerAttribute(key: String, resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let customerAttribute = NamiCustomerManager.getCustomerAttribute(key: key)
        resolve(customerAttribute)
    }

    @objc(clearCustomerAttribute:)
    func clearCustomerAttribute(key: String) {
        NamiCustomerManager.clearCustomerAttribute(key)
    }

    @objc(clearAllCustomerAttributes)
    func clearAllCustomerAttributes() {
        NamiCustomerManager.clearAllCustomerAttributes()
    }

    @objc(setCustomerDataPlatformId:)
    func setCustomerDataPlatformId(platformId: String) {
        NamiCustomerManager.setCustomerDataPlatformId(with: platformId)
    }
    
    @objc(clearCustomerDataPlatformId)
    func clearCustomerDataPlatformId() {
        NamiCustomerManager.clearCustomerDataPlatformId()
    }
    
    @objc(journeyState:rejecter:)
    func journeyState(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        if let journeyState = NamiCustomerManager.journeyState() {
            let dictionary = journeyStateToDictionary(journeyState)
            resolve(dictionary)
        } else {
            resolve(nil)
        }
    }

    @objc(isLoggedIn:rejecter:)
    func isLoggedIn(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let isLoggedIn = NamiCustomerManager.isLoggedIn()
        resolve(isLoggedIn)
    }

    @objc(loggedInId:rejecter:)
    func loggedInId(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let id = NamiCustomerManager.loggedInId()
        resolve(id)
    }

    @objc(deviceId:rejecter:)
    func deviceId(resolve: @escaping RCTPromiseResolveBlock, reject _: @escaping RCTPromiseRejectBlock) {
        let id = NamiCustomerManager.deviceId()
        resolve(id)
    }

    @objc(login:completion:)
    func login(customerId: String, callback: @escaping RCTResponseSenderBlock) {
        NamiCustomerManager.login(withId: customerId, loginCompleteHandler: { success, error in
            callback([success, error?._code as Any])
        })
    }

    @objc(logout:)
    func logout(callback: @escaping RCTResponseSenderBlock) {
        NamiCustomerManager.logout(logoutCompleteHandler: { success, error in
            callback([success, error?._code as Any])
        })
    }

    @objc(registerJourneyStateHandler)
    func registerJourneyStateHandler() {
        NamiCustomerManager.registerJourneyStateHandler { journeyState in
            let dictionary = self.journeyStateToDictionary(journeyState)
            self.sendEvent(withName: "JourneyStateChanged", body: dictionary)
        }
    }

    @objc(registerAccountStateHandler)
    func registerAccountStateHandler() {
        NamiCustomerManager.registerAccountStateHandler({action, success, error in
            let actionString: String
            switch action {
            case .login:
                actionString = "login"
            case .logout:
                actionString = "logout"
            @unknown default:
                actionString = "unknown"
            }
            let payload: [String: Any?] = [
                "action": actionString,
                "success": success,
                "error": error?._code as Any
            ]
            self.sendEvent(withName: "AccountStateChanged", body: payload)
        })
    }
}
