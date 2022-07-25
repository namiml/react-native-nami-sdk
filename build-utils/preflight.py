import os
import json
import sys
import re
import subprocess

# Regex to validate version numbers
PROD_VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")
PRERELEASE_VERSION_RE = re.compile(r"^\d+\.\d+\.\d+-(alpha|beta|rc)\.\d{2}$")

early_access = str(os.getenv("EARLY_ACCESS"))

# get the version out of source of truth
with open("package.json", "r") as f:
    package = json.load(f)
    nami_sdk_version = package["version"]

# Get git version
git_long_hash = (
    subprocess.check_output(["git", "log", "-1", "--format=%H"]).decode("utf-8").strip()
)

# Check what kind of release this is and guard against non-conforming version numbers
if PROD_VERSION_RE.match(nami_sdk_version):
    if early_access == "true":
        print(f"Early access value ('{early_access}') is not compatible with production version format '{nami_sdk_version}'")
        sys.exit(1)
    type_mods = ""
elif PRERELEASE_VERSION_RE.match(nami_sdk_version):
    if early_access == "false":
        print(f"Early access value ('{early_access}') is not compatible with early access version format '{nami_sdk_version}'")
        sys.exit(1)
    type_mods = "--prerelease"
else:
    print(f"SDK version '{nami_sdk_version}' does not conform to version spec")
    sys.exit(1)

# generate a shell command to create a release later
with open("gh-release-command.sh", "w") as f:
    f.write(
        f"gh release create --generate-notes --title v{nami_sdk_version} {type_mods} --target {git_long_hash} v{nami_sdk_version}"
    )

# report our status
print(f"Identified Version: {nami_sdk_version}")
