# Downloads ESG reports from our google drive to local

This is to ensure that we are aligned on the reports that we are working on
in the absence of cloud services to store our reports.

To run the scripts, you need the following:
1) .env file containing SERVICE_ACCOUNT_FILE (path to service account key in JSON)
2) Same .env file containing SERVICE_ACCOUNT_SCOPES(comma separated if more than 1)
3) Withint the same .env file, the destination folder (DEST_FOLDER) to hold your ESG reports locally
4) The necessary dependencies: run `pip install -r requirements.txt`

Once the pre-requisites are met,
run `python esg_gdrive_to_local.py`
