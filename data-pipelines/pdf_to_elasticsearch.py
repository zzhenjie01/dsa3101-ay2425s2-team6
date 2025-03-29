from esg_gdrive_to_local.esg_gdrive_to_local import esg_gdrive_to_local
from esg_pdf_to_json.esg_pdf_to_json import esg_pdf_to_json
from esg_json_to_csv.esg_json_to_csv import esg_json_to_csv
from esg_csv_to_elasticsearch.elasticsearch_indexing import esg_csv_to_elasticsearch
import os
from dotenv import load_dotenv
import sparknlp
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

# Load the environmental variables
load_dotenv()
SERVICE_ACCOUNT_FILE = os.getenv('SERVICE_ACCOUNT_FILE')
SERVICE_ACCOUNT_SCOPES = os.getenv('SERVICE_ACCOUNT_SCOPES')
ESG_REPORTS_PDF_FOLDER = os.getenv('ESG_REPORTS_PDF_FOLDER')
ESG_REPORTS_JSON_FOLDER = os.getenv('ESG_REPORTS_JSON_FOLDER')
ESG_REPORTS_CSV_FOLDER = os.getenv('ESG_REPORTS_CSV_FOLDER')
ES_INDEX_NAME = os.getenv('REPORT_ES_INDEX_NAME')
ES_HOST = os.getenv('ES_HOST')

if not os.path.exists(SERVICE_ACCOUNT_FILE):
    print('Service account JSON is missing')

if not os.path.exists(ESG_REPORTS_PDF_FOLDER):
    print('Directory containing ESG PDF is missing')

if not os.path.exists(ESG_REPORTS_JSON_FOLDER):
    print('Directory containing ESG JSON is missing')

if not os.path.exists(ESG_REPORTS_CSV_FOLDER):
    print('Directory containing ESG CSV is missing')

SPARK = sparknlp.start()
EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')

try:
    ES = Elasticsearch(ES_HOST)
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

esg_gdrive_to_local(SERVICE_ACCOUNT_FILE, SERVICE_ACCOUNT_SCOPES, ESG_REPORTS_PDF_FOLDER)
esg_pdf_to_json(ESG_REPORTS_PDF_FOLDER, ESG_REPORTS_JSON_FOLDER)
esg_json_to_csv(ESG_REPORTS_JSON_FOLDER, ESG_REPORTS_CSV_FOLDER, SPARK)
esg_csv_to_elasticsearch(ESG_REPORTS_CSV_FOLDER, ES, ES_INDEX_NAME, EMBEDDING_MODEL)
