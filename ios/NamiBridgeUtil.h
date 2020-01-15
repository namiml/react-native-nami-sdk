//
//  NamiBridgeUtil.h
//  RNNami
//
//  Created by Kendall Gelner on 1/9/20.
//  Copyright © 2020 Nami ML Inc. All rights reserved.
//

#ifndef NamiBridgeUtil_h
#define NamiBridgeUtil_h

@interface NamiBridgeUtil : NSObject
+ (NSDictionary<NSString *,NSString *> *) productToProductDict:(NamiMetaProduct *)product;
@end

#endif /* NamiBridgeUtil_h */
