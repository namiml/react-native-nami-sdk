//
//  RNConfig.swift
//  Basic
//
//  Created by Ivan Madera on 21.04.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

import UIKit
import Foundation

@objc(RNConfig)
class RNConfig: NSObject {
  
  @objc
  func constantsToExport() -> [String: Any]! {
    let schemeName = Bundle.main.infoDictionary!["CFBundleExecutable"] as! String
    var flavor: String?
    switch schemeName {
    case "BasicProduction":
      flavor = "production"
    case "Basic":
      flavor = "staging"
    default:
      flavor = nil
    }
    return ["FLAVOR": flavor]
  }
}
