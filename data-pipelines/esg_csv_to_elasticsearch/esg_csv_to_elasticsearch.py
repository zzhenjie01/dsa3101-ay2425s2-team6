import os
from dotenv import load_dotenv
from elasticsearch_indexing import esg_csv_to_elasticsearch
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer

def main():
    # Load the environmental variables
    load_dotenv()
    ESG_REPORTS_CSV_FOLDER = os.getenv('ESG_REPORTS_CSV_FOLDER')
    ES_INDEX_NAME = os.getenv('REPORT_ES_INDEX_NAME')
    ES_HOST = os.getenv('ES_HOST')

    if not os.path.exists(ESG_REPORTS_CSV_FOLDER):
        print('Directory containing ESG CSV is missing. Creating it...')
        os.makedirs(ESG_REPORTS_CSV_FOLDER)

    EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
    print('Embedding model loaded')

    try:
        ES = Elasticsearch(ES_HOST)
        print('Elasticsearch client created')
    except Exception as e:
        raise Exception(
            status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
        )

    esg_csv_to_elasticsearch(ESG_REPORTS_CSV_FOLDER, ES, ES_INDEX_NAME, EMBEDDING_MODEL)
    print('CSV to Elasticsearch indexing completed')

if __name__ == "__main__":
    main()