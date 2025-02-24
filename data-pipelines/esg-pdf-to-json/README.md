# Convert ESG reports locally from pdf to json

Loading files from .pdf format can be time consuming so
we perform a 1 time processing to convert it to .json so that it is easier to load
in the future

To run the scripts, you need the following:
1) .env file containing ESG_REPORTS_FOLDER (path to the folder containing the esg reports in .pdf)
2) Same .env file containing ESG_REPORTS_JSON_FOLDER (path to the folder containing the esg reports in .json)
3) The necessary dependencies: run `pip install -r requirements.txt` where requirements.txt is in data-pipelines/ folder

Once the pre-requisites are met,
run `python esg_pdf_to_json.py`
where command needs to be run within the folder containing esg_pdf_to_json.py
