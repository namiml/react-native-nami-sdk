#!/usr/bin/python3

import sys
import getopt
import json

from google.auth.exceptions import DefaultCredentialsError
from google.oauth2 import service_account
from googleapiclient import discovery, errors

from pyasn1.error import SubstrateUnderrunError

def printv(text):
    if show_output:
        print(text)

def create_edit(service, package_name):
    printv(f"Create an edit for the package {package_name}")
    try:
        edit_request = service.edits().insert(body={}, packageName=package_name)
        edit_response = edit_request.execute()
        printv(f"Created edit {edit_response} for package {package_name}")
    except (errors.Error, errors.HttpError) as e:
        raise(f"Error creating edit {e}")
    else:
        if "id" in edit_response:
            return edit_response["id"]

def delete_edit(service, package_name, edit_id):
    printv(f"Delete an edit for the package {package_name}")
    try:
        delete_request = service.edits().delete(packageName=package_name, editId=edit_id)
        delete_response = delete_request.execute()
        printv(f"Deleted edit {delete_response} for package {package_name}")
    except (errors.Error, errors.HttpError) as e:
        raise(f"Error deleting edit {e}")

def get_credentials_response(service_credentials_path):
    try:
        credentials_response = service_account.Credentials.from_service_account_file(
    service_credentials_path)
    except ValueError as error:
        printv(f"401: {error}")
        return None
    except DefaultCredentialsError as error:
        printv(f"401: {error}")
        return None
    except SubstrateUnderrunError as error:
        printv(f"401: The service credentials are malformed")
        return  None

    if type(credentials_response) is service_account.Credentials:
        return credentials_response
    else:
        printv(f"401: Unknown error with service account credentials.")
        return None

def get_track(service, package_name, edit_id, track_name):
    request = (
        service.edits().tracks()
        .get(packageName=package_name, editId=edit_id, track=track_name)
    )
    try:
        response = request.execute()
    except errors.HttpError as error:
        error_content = json.loads(error.content)
        if "error" in error_content:
            error = error_content["error"]

            if "code" in error:
                status_code = error["code"]
            else:
                status_code = 000

            if "message" in error:
                message = error["message"]
            else:
                message = "Unknown error"
                
            printv(f"{status_code}: {message}")
    else:
        printv(f"200: API request was successful")
        printv(response)
        version_codes = []
        if "releases" in response:
            releases = response["releases"]
            for release in releases:
                if "versionCodes" in release:
                    all_codes = release["versionCodes"]
                    for code in all_codes:
                        printv(code)
                        if code in version_codes:
                            pass
                        else:
                            version_codes.append(int(code))

        printv(f"observed codes: {version_codes}")
        new_version = max(version_codes)+1
        print(f"{new_version}")
        with open(".new_version_code", "w") as f:
            f.write(
                f"{new_version}"
            )

def get_version_code(service_credentials_path, package_name, track_name):
    credentials = get_credentials_response(service_credentials_path)

    service = discovery.build(
        "androidpublisher", "v3", credentials=credentials, cache_discovery=False
    )

    edit_id = create_edit(service, package_name)
    get_track(service, package_name, edit_id, track_name)
    delete_edit(service, package_name, edit_id)

if __name__ == "__main__":
    help_message = "get_version_code.py /path/to/service_credentials.json [package_name] [track_name] <OPTIONAL: --quiet>"

    if len(sys.argv) < 4:
        print(help_message)
        sys.exit(2)

    service_credentials = sys.argv[1] 

    package_name = sys.argv[2]
    track_name = sys.argv[3]

    show_output = True

    try:
        opts, args = getopt.getopt(sys.argv[4:], "", ["quiet"])
    except getopt.GetoptError:
        print(help_message)
        sys.exit(2)

    for opt, arg in opts:
        if opt in ("--quiet"):
            show_output = False

    get_version_code(service_credentials, package_name, track_name)
