
# react-native-nami-sdk

## Getting started iOS Steps
1. `npm install react-native-nami-sdk --save` or `yarn add react-native-nami-sdk`
2. add the following to your package.json scripts `"ios-setup": "cd ios && rm -rf Pods && rm -rf build && pod install"`
3. `npm run ios-setup` or `yarn run ios-setup`
4. `npm run ios` or `yarn run ios`

## Usage go here: [See an example here.](https://github.com/namiml/nami-react-native) or look at the example below
```javascript
import {
  NativeEventEmitter,
  NativeModules
} from 'react-native';

const App = () => {
  const [products, setProducts] = useState([])
  const { NamiEmitter } = NativeModules;
  const eventEmitter = new NativeEventEmitter(NamiEmitter);

  const subscribeAction = () => {
    NativeModules.NamiPaywallManagerBridge.presentPaywallNoArg()
  }

  const onSessionConnect = (event) => {
    console.log("Products changed: ", event);
    setProducts(event.products);
    setSubscribe(products.length === 0);
  }

  useEffect(() => {
    // to see whats coming out the console in debug mode
    console.log("HavePaywallManager", NativeModules.NamiPaywallManagerBridge)
    
    eventEmitter.addListener('PurchasesChanged', onSessionConnect);
    NativeModules.NamiStoreKitHelperBridge.clearBypassStoreKitPurchases();
    NativeModules.NamiBridge.configureWithAppID('YOUR_APP_ID');

  }, []);


  return (
    <>Your View</>
  );
}

export default App;
```
