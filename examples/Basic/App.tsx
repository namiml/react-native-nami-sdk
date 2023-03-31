import React, {useEffect} from 'react';
import {NativeEventEmitter, NativeModules, Alert, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CampaignScreen from './containers/CampaignScreen';
import {usePurchasesContext} from './hooks/usePurchases';

export const UNTITLED_HEADER_OPTIONS = {
  title: '',
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerStyle: {backgroundColor: 'transparent'},
};

type ViewerTabNavigatorParams = {
  Campaign: undefined;
};

export interface ViewerTabProps<
  RouteParam extends keyof ViewerTabNavigatorParams,
> {
  navigation: NativeStackNavigationProp<ViewerTabNavigatorParams, RouteParam>;
}

const Tab = createBottomTabNavigator<ViewerTabNavigatorParams>();

const App = () => {
  const {setPurchases} = usePurchasesContext();
  const {NamiEmitter} = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);

  const onPurchasesChanged = (event) => {
    console.log('ExampleApp: Purchases changed: ', event);
    if (event.purchaseState == 'PURCHASED') {
      console.log('Detected purchase, setting SKU IDs');
      setPurchases(event.purchases);
    }
  };

  const onEntitlementsChanged = (event) => {
    // Add code to check for entitlements activating or deactivating features
    console.log(
      'ExampleApp: Data for entitlements changed ',
      event.activeEntitlements,
    );
  };

  const onSignInActivated = (event) => {
    // Add code to present UI for sign-in
    console.log('ExampleApp: Data for sign-in ', event);
  };

  const onRestorePurchasesStateChanged = (event) => {
    console.log('Restore Purchases State Change: ', event);
    if (event.stateDesc == 'started') {
      // Present "Restore Started" message if desired.
    } else if (event.stateDesc == 'finished') {
      console.log('ExampleApp: Nami purchases are ', event.newPurchases);
      console.log('Purchase count is ', event.newPurchases.length);
      if (event.newPurchases.length > 0) {
        Alert.alert('Restore Complete', 'Found your subscription!', [
          {text: 'OK', onPress: () => console.log('Found Purchase Confirmed')},
        ]);
      } else {
        Alert.alert('Restore Complete', 'No active subscriptions found.', [
          {text: 'OK', onPress: () => console.log('Found Purchase Confirmed')},
        ]);
      }
    } else if (event.stateDesc == 'error') {
      Alert.alert('Restore Failed', 'Restore failed to complete.', [
        {
          text: 'OK',
          onPress: () =>
            console.log('Restore Purchase Error was' + event.error),
        },
      ]);
    }
  };

  useEffect(() => {
    console.log('NativeModules', NativeModules);
    console.log('ExampleApp: Nami Bridge is');
    if (
      eventEmitter?._subscriber?._subscriptionsForType?.PurchasesChanged == null
    ) {
      eventEmitter.addListener('PurchasesChanged', onPurchasesChanged);
    }

    if (
      eventEmitter?._subscriber?._subscriptionsForType?.SignInActivate == null
    ) {
      eventEmitter.addListener('SignInActivate', onSignInActivated);
    }

    if (
      eventEmitter?._subscriber?._subscriptionsForType
        ?.RestorePurchasesStateChanged == null
    ) {
      eventEmitter.addListener(
        'RestorePurchasesStateChanged',
        onRestorePurchasesStateChanged,
      );
    }

    if (
      eventEmitter?._subscriber?._subscriptionsForType?.EntitlementsChanged ==
      null
    ) {
      eventEmitter.addListener('EntitlementsChanged', onEntitlementsChanged);
    }

    console.log(
      'ExampleApp: HavePaywallManager',
      NativeModules.NamiPaywallManagerBridge,
    );

    let configDict = {
      'appPlatformID-apple': '002e2c49-7f66-4d22-a05c-1dc9f2b7f2af',
      'appPlatformID-google': '3d062066-9d3c-430e-935d-855e2c56dd8e',
      logLevel: 'DEBUG',
      developmentMode: false,
      bypassStore: false,
    };

    NativeModules.NamiBridge.configure(configDict);
    NativeModules.NamiPurchaseManagerBridge.clearBypassStorePurchases();

    // NativeModules.NamiBridge.clearExternalIdentifier((error) => {
    //   if (error) {
    //     console.error(`EI- Error clearExternalIdentifier! ${error}`);
    //   } else {
    //     console.log(`EI- clearExternalIdentifier was successful`);

    //     NativeModules.NamiBridge.getExternalIdentifier((ei) => {
    //       console.log(
    //         `EI- getExternalIdentifier after clear ${ei} (expected nil)`,
    //       );
    //     });

    //     NativeModules.NamiBridge.setExternalIdentifier(
    //       'f1851c87-e0ff-4349-a824-cd9b5e5211b9',
    //       'uuid',
    //       (error) => {
    //         if (error) {
    //           console.error(`EI- Error setExternalIdentifier (f185)! ${error}`);
    //         } else {
    //           console.log(`EI- setExternalIdentifier was successful (f185)`);

    //           NativeModules.NamiBridge.getExternalIdentifier((ei) => {
    //             console.log(
    //               `EI- getExternalIdentifier after clear ${ei} (expected f185)`,
    //             );
    //           });

    //           NativeModules.NamiBridge.clearExternalIdentifier((error) => {
    //             if (error) {
    //               console.error(`EI- Error clearExternalIdentifier! ${error}`);
    //             } else {
    //               console.log(`EI- clearExternalIdentifier was successful`);

    //               NativeModules.NamiBridge.getExternalIdentifier((ei) => {
    //                 console.log(
    //                   `EI- getExternalIdentifier after clear ${ei} (expected nil)`,
    //                 );
    //               });

    //               NativeModules.NamiBridge.setExternalIdentifier(
    //                 'b909a31c-7a73-11ed-a1eb-0242ac120002',
    //                 'uuid',
    //                 (error) => {
    //                   if (error) {
    //                     console.error(
    //                       `EI- Error setExternalIdentifier (b909)! ${error}`,
    //                     );
    //                   } else {
    //                     console.log(
    //                       `EI- setExternalIdentifier was successful (b909)`,
    //                     );

    //                     NativeModules.NamiBridge.getExternalIdentifier((ei) => {
    //                       console.log(
    //                         `EI- getExternalIdentifier after clear ${ei} (expected b909)`,
    //                       );
    //                     });
    //                   }
    //                 },
    //               );
    //             }
    //           });
    //         }
    //       },
    //     );
    // }
    // });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Campaign"
          component={CampaignScreen}
          options={UNTITLED_HEADER_OPTIONS}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
