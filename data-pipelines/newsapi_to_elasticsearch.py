from newsapi_csv_to_elasticsearch.newsapi_csv_to_elasticsearch_func import external_data_csv_to_elasticsearch
from newsapi_web_to_csv.newsapi_web_to_csv_func import bs4_scrape_by_bankname_into_csv
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from newsapi import NewsApiClient
from elasticsearch import Elasticsearch

'''
Given a list of companies and a start and end date,
scrape for relevant data using NewsAPI and store as CSV.
Uploads CSV files onto ElasticSearch afterwards
'''
load_dotenv()

LST_OF_COMPANIES = ["Citigroup", "Banco-Santander", "BOQ", "DBS", "HSBC",
                    "JPMorgan", "Krungthai-Bank", "Nubank", "OCBC", "Woori",
                    "ANZ", "Bank-of-China", "Commonwealth-Bank-of-Australia"]
NEWSAPI_API_KEY = os.getenv("NEWSAPI_API_KEY")
EXTERNAL_SCRAPE_INDEX_NAME = os.getenv("EXTERNAL_SCRAPE_INDEX_NAME")
EXTERNAL_ESG_DATA_CSV_FOLDER = os.getenv("EXTERNAL_ESG_DATA_CSV_FOLDER")
START_DATE = "2025-02-28"
END_DATE = "2025-03-27"
ES_HOST = os.getenv('ES_HOST')
EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')

try:
    ES = Elasticsearch(ES_HOST)
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

NEWSAPI = NewsApiClient(api_key = NEWSAPI_API_KEY)
# create CSV files into directory
for company in LST_OF_COMPANIES:
    bs4_scrape_by_bankname_into_csv(NEWSAPI, START_DATE, END_DATE, company, EXTERNAL_ESG_DATA_CSV_FOLDER)

# upload all CSV files onto elasticsearch
external_data_csv_to_elasticsearch(EXTERNAL_ESG_DATA_CSV_FOLDER, ES, EXTERNAL_SCRAPE_INDEX_NAME, EMBEDDING_MODEL)
