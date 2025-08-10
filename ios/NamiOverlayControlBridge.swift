import Foundation
import React
import UIKit

#if RCT_NEW_ARCH_ENABLED
    extension RNNamiPaywallManager: RCTTurboModule {}
#endif

@objc(RNNamiOverlayControl)
class NamiOverlayControlBridge: RCTEventEmitter {
    private var overlayViewController: UIViewController?
    private var hasListeners = false
    private var isPresenting = false
    private var isDismissing = false

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    override func supportedEvents() -> [String]! {
        return ["NamiOverlayReady", "NamiOverlayResult"]
    }

    override func startObserving() { hasListeners = true }
    override func stopObserving() { hasListeners = false }

    private func safeSend(withName name: String, body: Any?) {
        guard hasListeners else {
            print("[RNNamiOverlayControl] Warning: no listeners, so event not being sent to JS.")
            return
        }
        sendEvent(withName: name, body: body)
    }

    @objc func presentOverlay(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            // If we're already presenting or dismissing, wait and retry
            if self.isPresenting || self.isDismissing {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    self.presentOverlay(resolve, rejecter: reject)
                }
                return
            }

            // Find the root view controller more reliably
            var rootViewController: UIViewController?

            if #available(iOS 13.0, *) {
                rootViewController = UIApplication.shared.connectedScenes
                    .compactMap { $0 as? UIWindowScene }
                    .flatMap { $0.windows }
                    .first(where: { $0.isKeyWindow })?.rootViewController
            } else {
                rootViewController = UIApplication.shared.keyWindow?.rootViewController
            }

            guard let rootVC = rootViewController else {
                reject("NO_ROOT_VIEW_CONTROLLER", "No root view controller available", nil)
                return
            }

            // Create a React Native view controller for the overlay
            guard let bridge = self.bridge else {
                reject("NO_BRIDGE", "React Native bridge not available", nil)
                return
            }

            let rootView = RCTRootView(
                bridge: bridge,
                moduleName: "NamiOverlayHost",
                initialProperties: [:]
            )

            let overlayViewController = UIViewController()
            overlayViewController.view = rootView
            overlayViewController.modalPresentationStyle = .overFullScreen
            overlayViewController.modalTransitionStyle = .crossDissolve
            overlayViewController.view.backgroundColor = UIColor.clear

            self.overlayViewController = overlayViewController

            // Find the top-most presented view controller
            var topController = rootVC
            while let presented = topController.presentedViewController {
                topController = presented
            }

            // Check if the top controller can present (not already in the process of presenting/dismissing)
            if topController.isBeingPresented || topController.isBeingDismissed {
                // Wait longer and try again
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    self.presentOverlay(resolve, rejecter: reject)
                }
                return
            }

            self.isPresenting = true

            topController.present(overlayViewController, animated: false) {
                self.isPresenting = false
                // Emit ready event after presentation completes
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                    if self.hasListeners {
                        self.safeSend(withName: "NamiOverlayReady", body: nil)
                    }
                }
                resolve(nil)
            }
        }
    }

    @objc func finishOverlay(_ result: NSDictionary?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter _: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            guard let overlayViewController = self.overlayViewController else {
                resolve(nil)
                return
            }

            // Emit result to listeners
            if self.hasListeners {
                self.safeSend(withName: "NamiOverlayResult", body: result)
            }

            self.isDismissing = true

            overlayViewController.dismiss(animated: false) {
                self.overlayViewController = nil
                self.isDismissing = false
                // Add a longer delay before resolving to ensure the view controller is fully dismissed
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                    resolve(nil)
                }
            }
        }
    }
}
