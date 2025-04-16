//
//  RCTNativeBuildFlavor.m
//  Basic
//
//  Copyright © 2025 Facebook. All rights reserved.
//

#import "RCTNativeBuildFlavor.h"

@implementation RCTNativeBuildFlavor

RCT_EXPORT_MODULE(NativeLocalStorage)

- (id) init {
  if (self = [super init]) {
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeBuildFlavorSpecJSI>(params);
}

- (NSString *)getBuildFlavor {
  NSDictionary* infoDict = [[NSBundle mainBundle] infoDictionary];
  NSString* bundleName = [infoDict objectForKey:@"CFBundleExecutable"];

  if([bundleName isEqualToString:@"BasicProduction"]) {
    return @"production";
  } else if([bundleName isEqualToString:@"Basic"]) {
    return @"staging";
  } else {
    return @"unknown";
  }
}

@end
