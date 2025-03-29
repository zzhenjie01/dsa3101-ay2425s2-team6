from .esg_gdrive_to_local_func import *
import os
from dotenv import load_dotenv

'''
main file to download ESG reports from gdrive to local
'''
def esg_gdrive_to_local(svc_acc_file, svc_acc_scope, pdf_des_loc):
    svc_acc_scope = [scope for scope in svc_acc_scope.split(",") if scope != '']
    # Create the destination directory if it does not exist
    if not os.path.exists(pdf_des_loc):
        os.makedirs(pdf_des_loc)
    gdrive_service = build_gdrive_svc(svc_acc_file, svc_acc_scope)
    download_esg_reports(gdrive_service, pdf_des_loc)
