require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))


Pod::Spec.new do |s|
  s.name         = package['name']
  s.version      = package['version']
  s.summary      = package['description']

  s.author       = { "Nami ML Inc." => "info@namiml.com" }

  s.homepage     = package['homepage']
  s.license      = package['license']

  s.platform     = :ios, "11.2"
  s.source       = { :git => "https://github.com/namiml/react-native-nami-sdk.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency 'Nami', '3.0.7'
  s.dependency 'React'

end
