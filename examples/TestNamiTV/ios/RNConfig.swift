//
//  RNConfig.swift
//  Basic
//
//  Created by Ivan Madera on 21.04.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(RNConfig)
class RNConfig: NSObject {
    @objc
    func constantsToExport() -> [String: Any]! {
        let schemeName = Bundle.main.infoDictionary!["CFBundleExecutable"] as! String
        var flavor: String = "production"
        switch schemeName {
        case "Basic-tvOS-PROD":
            flavor = "production"
        case "Basic-tvOS":
            flavor = "staging"
        default:
            flavor = "production"
        }
        return ["FLAVOR": flavor]
    }
}
