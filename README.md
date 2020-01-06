
# react-native-nami-sdk

## Getting started

`$ npm install react-native-nami-sdk --save`

### Mostly automatic installation

`$ react-native link react-native-nami-sdk`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-nami-sdk` and add `RNNami.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNNami.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNNamiPackage;` to the imports at the top of the file
  - Add `new RNNamiPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-nami-sdk'
  	project(':react-native-nami-sdk').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-nami-sdk/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-nami-sdk')
  	```

## Usage
```javascript
import RNNami from 'react-native-nami-sdk';

// TODO: What to do with the module?
RNNami;
```
  
