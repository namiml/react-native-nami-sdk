import { getInitialConfig } from './getInitialConfig';

// import NativeBuildFlavor from '../specs/NativeBuildFlavor';

export function getConfigObject() {
  // const flavor = NativeBuildFlavor.getBuildFlavor();
  const flavor = "staging";
  console.log('Build flavor', flavor);
  switch (flavor) {
    case 'staging':
      return {
        'appPlatformID-apple': '4a2f6dbf-e684-4d65-a4df-0488771c577d',
        'appPlatformID-android': 'b7232eba-ff1d-4b7f-b8d0-55593b66c1d5',
        logLevel: 'DEBUG',
        namiCommands: ['useStagingAPI', 'useNamiWindow'],
        initialConfig: getInitialConfig(),
      };
    default:
      return {
        'appPlatformID-apple': 'APPLE_PROD_APP_PLATFORM_ID',
        'appPlatformID-android': 'ANDROID_PROD_APP_PLATFORM_ID',
        logLevel: 'DEBUG',
        initialConfig: getInitialConfig(),
      };
  }
}
