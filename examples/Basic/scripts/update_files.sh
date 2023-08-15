#!/bin/bash

# Navigate to the root directory
cd "$(dirname "$0")"/.. || exit 1

# Step 1: Update babel.config.js
echo "module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};" > babel.config.js

# Step 2: Update metro.config.js
echo "/* Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};" > metro.config.js

# Step 3: Delete react-native.config.js
rm react-native.config.js

# Step 4: Update tsconfig.json
echo "{
  \"compilerOptions\": {
    \"target\": \"esnext\",
    \"module\": \"commonjs\",
    \"lib\": [\"es6\"],
    \"allowJs\": true,
    \"jsx\": \"react-native\",
    \"noEmit\": true,
    \"isolatedModules\": true,
    \"strict\": true,
    \"moduleResolution\": \"node\",
    \"allowSyntheticDefaultImports\": true,
    \"esModuleInterop\": true,
    \"resolveJsonModule\": true
  },
  \"exclude\": [
    \"node_modules\", \"babel.config.js\", \"metro.config.js\", \"jest.config.js\"
  ]
}" > tsconfig.json

# Step 5 Insert react-native-nami-sdk
cat > package.json <<EOL
{
  "name": "basic",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "android-clean": "cd android && rm -rf .gradle && rm -rf .idea && rm -rf android.iml && rm -rf local.properties",
    "ios": "react-native run-ios",
    "ios-setup": "cd ios && pod install",
    "ios-clean": "cd ios && rm -rf Pods && rm -rf build",
    "ios-setup-clean": "cd ios && rm -rf Pods && rm -rf build  && pod update && pod install",
    "start": "react-native start",
    "start:legacy": "NODE_OPTIONS=--openssl-legacy-provider react-native start --reset-cache",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "test:e2e": "detox test --configuration android.emu.debug",
    "i": "echo 'Examples: \"yarn i both\"- run all setups, \"yarn i ios\"- run ios' && scripts/install.sh",
    "b": "echo 'Examples: \"yarn b ios\", \"yarn b android\"' && scripts/building.sh",
    "d": "./scripts/detox.sh"
  },
  "dependencies": {
    "@react-native-community/cli-platform-android": "^11.3.1",
    "@react-native-community/masked-view": "^0.1.11",
    "@react-navigation/bottom-tabs": "^6.5.7",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "react": "17.0.2",
    "react-native": "0.65.2",
    "react-native-gesture-handler": "^2.1.0",
    "react-native-nami-sdk": "file:../../",
    "react-native-reanimated": "^2.3.1",
    "react-native-safe-area-context": "^3.3.2",
    "react-native-screens": "^3.20.0"
  },
  "devDependencies": {
    "@babel/core": "^7.16.5",
    "@babel/runtime": "^7.16.5",
    "@react-native-community/eslint-config": "^3.2.0",
    "@tsconfig/react-native": "^2.0.3",
    "@types/jest": "^29.5.2",
    "@types/react": "^18.2.14",
    "@types/react-native": "^0.72.2",
    "@types/react-test-renderer": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.57.1",
    "@typescript-eslint/parser": "^5.57.1",
    "babel-jest": "^27.4.5",
    "babel-plugin-module-resolver": "^5.0.0",
    "detox": "^20.9.1",
    "eslint": "^8.37.0",
    "eslint-plugin-import": "^2.28.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-native": "^4.0.0",
    "jest": "^29.5.0",
    "metro-react-native-babel-preset": "^0.66.2",
    "prettier": "^2.8.7",
    "react-native-codegen": "^0.0.12",
    "react-test-renderer": "17.0.2",
    "typescript": "^5.1.6"
  },
  "jest": {
    "preset": "react-native"
  },
  "resolutions": {
    "react-native-gesture-handler": "2.1.0"
  }
}
EOL

echo "Files updated successfully."
