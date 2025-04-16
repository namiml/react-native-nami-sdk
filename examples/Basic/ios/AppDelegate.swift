//
//  AppDelegate.swift
//
//
//  Created by dannami on 3/28/25.
//

import Foundation
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UIKit

@main
class AppDelegate: RCTAppDelegate {
    override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        moduleName = "Basic"
        dependencyProvider = RCTAppDependencyProvider()

        // You can add your custom initial props in the dictionary below.
        // They will be passed down to the ViewController used by React Native.
        initialProps = [:]

        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    override func sourceURL(for _: RCTBridge) -> URL? {
        bundleURL()
    }

    override func bundleURL() -> URL? {
        #if DEBUG
            RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
            Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
