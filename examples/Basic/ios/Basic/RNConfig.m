//
//  RNConfig.m
//  Basic
//
//  Created by Ivan Madera on 21.04.2023.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNConfig, NSObject)

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end
