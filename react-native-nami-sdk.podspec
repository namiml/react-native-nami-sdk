require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))


Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']

  s.author       = { "Nami ML Inc." => "info@namiml.com" }

  s.homepage     = package['homepage']
  s.license      = package['license']

  s.platforms = { :ios => "15.0", :tvos => "15.0" }


  s.source       = { :git => "https://github.com/namiml/react-native-nami-sdk.git", :tag => "#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc  = true
  s.swift_version = '5.0'  # or your supported version

  s.dependency 'Nami', '3.3.3.2'
  s.dependency 'React'

  pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_VERSION' => '5.0'
  }

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1'
    pod_target_xcconfig.merge!({
      'USE_HEADERMAP' => 'YES',
      'OTHER_SWIFT_FLAGS' => '$(inherited) -DRCT_NEW_ARCH_ENABLED',
      'GCC_PREPROCESSOR_DEFINITIONS' => '$(inherited) COCOAPODS=1 RCT_NEW_ARCH_ENABLED=1',
      'OTHER_CFLAGS' => '$(inherited) -DRCT_NEW_ARCH_ENABLED',
      'OTHER_CPLUSPLUSFLAGS' => '$(inherited) -DRCT_NEW_ARCH_ENABLED'
    })

    # Optional: Swift flag for user target
    s.user_target_xcconfig = {
      'OTHER_SWIFT_FLAGS' => '$(inherited) -DRCT_NEW_ARCH_ENABLED'
    }
  end

  s.pod_target_xcconfig = pod_target_xcconfig

  install_modules_dependencies(s)
end
