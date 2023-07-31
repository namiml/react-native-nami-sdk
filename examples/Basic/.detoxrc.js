/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 300000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Basic.app',
      build:
        'xcodebuild -workspace ios/Basic.xcworkspace -scheme Basic -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/BasicProduction.app',
      build: "export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace ios/Basic.xcworkspace -UseNewBuildSystem=NO -scheme BasicProduction -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet",
    },
    'staging.android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/staging/debug/app-staging-debug.apk',
      build:
        'cd android && ./gradlew assembleStagingDebug assembleStagingDebugAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081],
    },
    'production.android.release': {
      type: 'android.apk',
      binaryPath:
          'android/app/build/outputs/apk/production/release/app-production-release-unsigned-signed.apk',
      testBinaryPath:
          'android/app/build/outputs/apk/androidTest/production/release/app-production-release-androidTest-signed.apk',
      build: 'cd android && ./gradlew assembleProductionRelease assembleProductionReleaseAndroidTest -DtestBuildType=release && cd ..'
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30_AOSP',
      },
    },
    emulatorLocal: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.att.debug': {
      device: 'attached',
      app: 'staging.android.debug',
    },
    'android.att.release': {
      device: 'attached',
      app: 'production.android.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'staging.android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'production.android.release',
    },
    'android.emu.debug.local': {
      device: 'emulatorLocal',
      app: 'staging.android.debug',
    },
    'android.emu.release.local': {
      device: 'emulatorLocal',
      app: 'production.android.release',
    },
  },
};
