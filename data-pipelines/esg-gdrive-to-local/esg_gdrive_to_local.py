from esg_gdrive_to_local_func import *
import os
from dotenv import load_dotenv

'''
main file to download ESG reports from gdrive to local
'''
if __name__ == '__main__':
    load_dotenv()
    SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE")
    SERVICE_ACCOUNT_SCOPES = [scope for scope in os.getenv("SERVICE_ACCOUNT_SCOPES").split(",") if scope != '']
    DEST_LOC = os.getenv("DEST_FOLDER")
    # Create the destination directory if it does not exist
    if not os.path.exists(DEST_LOC):
        os.makedirs(DEST_LOC)
    gdrive_service = build_gdrive_svc(SERVICE_ACCOUNT_FILE, SERVICE_ACCOUNT_SCOPES)
    download_esg_reports(gdrive_service, DEST_LOC)