# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html
# --- React Native Core ---
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *

-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}

-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
    void set*(***);
    *** get*();
}

-keep class com.facebook.react.** { *; }
-keep interface com.facebook.react.bridge.** { *; }
-dontwarn com.facebook.react.**

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }

-keepclassmembers,includedescriptorclasses class * { native <methods>; }

-keepclassmembers class *  {
    @com.facebook.react.uimanager.UIProp <fields>;
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# --- Detox ---
-keep class com.wix.detox.** { *; }
-dontwarn com.wix.detox.**

# Detox sometimes relies on RN internals via interfaces
-keep interface com.facebook.react.bridge.** { *; }

# Keep Kotlin reflection internals
-keep class kotlin.reflect.** { *; }
-dontwarn kotlin.reflect.**

# Keep Kotlin metadata (for reflection)
-keepattributes KotlinMetadata

# Keep Kotlin stdlib and coroutines
-keep class kotlin.** { *; }
-dontwarn kotlin.**

-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# Optional but helpful for readable stack traces
-keepattributes SourceFile,LineNumberTable

# --- Networking Libraries (okhttp / okio) ---
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**

-keep class sun.misc.Unsafe { *; }
-dontwarn java.nio.file.*
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn okio.**

# --- Misc ---
-dontwarn android.text.StaticLayout  # Used by TextLayoutBuilder

# Optional: disable shrinking entirely if needed
# -dontshrink

# Prevent Guava's ListenableFuture and other internals from being stripped
-keep class com.google.common.util.concurrent.** { *; }
-dontwarn com.google.common.**
