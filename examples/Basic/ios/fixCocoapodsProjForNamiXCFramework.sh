#!/bin/sh

## Created by Kendall Gelner for NamiML on April 20th, 2020.
## This script corrects an error in Cocopods Pods.xcodeproject generation, where Nami.xcframeowrk is included as a file reference, but is not used as a build reference for the react-native-nami-sdk bridge pulled in via Podfile.

## Run this script after "pod install", before compilation of the react natuve project.  Run in directory just above generated "Pods" directory.


PROJECT_FILE="Pods/Pods.xcodeproj/project.pbxproj"
PROJECT_EDITED_FILE="/tmp/project-final-edit.pbxproj"

if [ -d "Pods" ]
then
    echo Modifying project file ${PROJECT_FILE} in `pwd`
else
    echo "Pods directory not detected, exiting repair script."
    exit
fi


echo "Checking for existing Nami.xcframework target linking..."
EXISTING_CHECK=`grep "Nami.xcframework.*PBXBuildFile" ${PROJECT_FILE}`

if [ -z "${EXISTING_CHECK}" ]
then
    echo "Nami.xcframework target membership not set, repairing."
else
    echo "Project file already has existing Nami.xcframework target membership, no repair required."
    exit
fi

echo looking for PBXFileRef referencing Nami.xcframework

# Look for refernce, find first elemnet and trim whitespace with xargs
# In file: B001EE85E9E6EF4F1F40F37237FE4631 /* Nami.xcframework */ = {isa = PBXFileReference; includeInIndex = 1; path = Nami.xcframework; sourceTree = "<group>"; };
NAMIXC_PBXFILEREF=`grep "Nami.xcframework" ${PROJECT_FILE} | grep "isa = PBXFileReference" | cut -d " " -f 1 | xargs`

echo "Nami.xcframework PBXBuildFile reference is ${NAMIXC_PBXFILEREF}"



# These build file reference lines will get added later in the final AWK script.

# This ID is one Xcode generated for use by the Nami framework, re-using the generated code should not overlap with anything pre-existing.
BUILD_FILE_REF="EBA7F0FF244E651F0048F322"
BUILD_FILE_LINE=" 		${BUILD_FILE_REF} /* Nami.xcframework in Frameworks */ = {isa = PBXBuildFile; fileRef = ${NAMIXC_PBXFILEREF} /* Nami.xcframework */; };"

echo "Adding build file ref line"
echo "${BUILD_FILE_LINE}"


# Find the ID of the react-native-nami-sdk target
TARGET_ID_REF=`grep "react-native-nami-sdk" ${PROJECT_FILE} | grep "target =" | cut -d " " -f 3`

echo "Found target ID Ref for reaxt-native-nami-sdk: ${TARGET_ID_REF}"

if [ -z "${TARGET_ID_REF}" ]
then
    echo "Could not find target ID for react-native-nami-sdk, make sure bridge is added to pacakges.json"
    exit
fi


# Now find the ID for the incldued frameworks section of the react-native-nami-sdk
awkFindFramework='                                                                                                           
BEGIN { found = 0 }                                                                                                          
$0 ~ TARGET_ID_REF { if ($0 ~ "= {") { found = 1 } }                                                                         
/Frameworks/ { if (found == 1) {                                                                                             
  print $1;
  found = 0                                                                                                                  
  }                                                                                                                          
}                                                                                                                            
'

FRAMEWORK_BUILD_PHASE_ID=`awk -v TARGET_ID_REF=${TARGET_ID_REF} "${awkFindFramework}" ${PROJECT_FILE}`
echo "Found react-native-nami-sdk Framework Build Phase ID  ${FRAMEWORK_BUILD_PHASE_ID}"

if [ -z "${FRAMEWORK_BUILD_PHASE_ID}" ]
then
    echo "Could not find Framework section reference ID for react-native-nami-sdk, make sure bridge is added to pacakges.json"
    exit
fi


FRAMEWORK_BUILD_PHASE_LINE="				${BUILD_FILE_REF} /* Nami.xcframework in Frameworks */,"

echo "Using build phase line:"
echo "${FRAMEWORK_BUILD_PHASE_LINE}"

# This AWK script does two replacements, adding in the build reference for the Nami.xcframework, and then adding that reference to the Frameworks section of react-native-nami-sdk

awkAddBuildFileRef='                                                                                                           
BEGIN { found = 0; blockPrint = 0 }
$0 ~ FRAMEWORK_BUILD_PHASE_ID { if ($0 ~ "= {") { found = 1 } }
/files =/ { if (found == 1) {
  print $0;
  print FRAMEWORK_BUILD_PHASE_LINE;
  found = 0
  blockPrint = 1
  }
 } 
/react-native-nami-sdk-dummy.*PBXBuildFile/ { print $0; print BUILD_FILE_LINE; blockPrint = 1 }
{if (blockPrint != 1) {print $0 } else { blockPrint = 0} }
'

awk -v FRAMEWORK_BUILD_PHASE_ID="${FRAMEWORK_BUILD_PHASE_ID}" -v BUILD_FILE_LINE="${BUILD_FILE_LINE}" -v FRAMEWORK_BUILD_PHASE_LINE="${FRAMEWORK_BUILD_PHASE_LINE}" "${awkAddBuildFileRef}" ${PROJECT_FILE} > ${PROJECT_EDITED_FILE}

echo "Final edited file is located in ${PROJECT_EDITED_FILE}"
echo "Replacing original project file ${PROJECT_FILE} with edited file."
echo "Cocoapods project Nami.xcframework repair complete."

cp ${PROJECT_EDITED_FILE} ${PROJECT_FILE}
