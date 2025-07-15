require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))


Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']

  s.author       = { "Nami ML Inc." => "info@namiml.com" }

  s.homepage     = package['homepage']
  s.license      = package['license']

  s.platforms = { :ios => "14.0", :tvos => "15.0" }


  s.source       = { :git => "https://github.com/namiml/react-native-nami-sdk.git", :tag => "#{s.version}" }
  s.source_files  = "ios/**/*.{h,m,mm,swift}"
  s.requires_arc  = true
  s.swift_version = '5.0'  # or your supported version

  s.dependency 'Nami', '3.3.0.3'
  s.dependency 'React'

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_VERSION" => "5.0",
  }

  install_modules_dependencies(s)

  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.pod_target_xcconfig = {
      'USE_HEADERMAP' => 'YES',
    }
   end

end
