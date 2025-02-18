from esg_gdrive_to_local_func import *
import os
from dotenv import load_dotenv

load_dotenv()
SERVICE_ACCOUNT_FILE = os.getenv("SERVICE_ACCOUNT_FILE")
SERVICE_ACCOUNT_SCOPES = [scope for scope in os.getenv("SERVICE_ACCOUNT_SCOPES").split(",") if scope != '']
DEST_LOC = os.getenv("DEST_FOLDER")
gdrive_service = build_gdrive_svc(SERVICE_ACCOUNT_FILE, SERVICE_ACCOUNT_SCOPES)
download_esg_reports(gdrive_service, DEST_LOC)