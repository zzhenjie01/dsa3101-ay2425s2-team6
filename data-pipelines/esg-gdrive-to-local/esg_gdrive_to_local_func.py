from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import io

'''
given scope and location of service account json key,
build a gdrive service
'''
def build_gdrive_svc(svc_acc_json_key, svc_scope):
    credentials = service_account.Credentials.from_service_account_file(
        svc_acc_json_key, scopes=svc_scope)
    drive_service = build('drive', 'v3', credentials=credentials)
    return drive_service

'''
Obtains the folder id containing the ESG bank reports
'''
def get_bank_reports_folder_id(gdrive_svc):
    folder_name = "Banks"
    query = f"mimeType = 'application/vnd.google-apps.folder' and name = '{folder_name}'"
    bank_reports_folder = gdrive_svc.files().list(q=query).execute()
    bank_reports_folder_id = bank_reports_folder['files'][0]['id']
    return bank_reports_folder_id

'''
Obtains all id and name of bank reports to be downloaded
'''
def get_bank_reports_id_and_name(gdrive_svc):
    bank_reports_folder_id = get_bank_reports_folder_id(gdrive_svc)
    query = f"'{bank_reports_folder_id}' in parents"
    bank_reports = gdrive_svc.files().list(q=query).execute()
    bank_reports_id_and_name = [(report['id'], report['name']) for report in bank_reports['files']]
    return bank_reports_id_and_name

'''
Function takes in google drive service
and destination_folder directory "ending with /"
and outputs file in the specified destination folder
'''
def download_esg_reports(gdrive_svc, destination_folder):
    bank_reports_id_and_name = get_bank_reports_id_and_name(gdrive_svc)
    for file_id, file_name in bank_reports_id_and_name:
        request = gdrive_svc.files().get_media(fileId = file_id)
        file = io.BytesIO()
        downloader = MediaIoBaseDownload(file, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            print(f"Download for {file_name}: {int(status.progress() * 100)}.")
        with open(destination_folder + file_name, "wb") as f:
            f.write(file.getvalue())