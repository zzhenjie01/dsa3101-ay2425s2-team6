from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from langchain_ollama.llms import OllamaLLM
import os
import pandas as pd
from dotenv import load_dotenv
from fact_check_esg_report_against_ext.fact_check_esg_report_against_ext_func \
    import obtain_esg_report_json_data, knn_search, fact_check
'''
Given each fact obtained from ESG report,
some external data is retrieved using Elasticsearch
and then processed by llama3.2 from Ollama for evaluation 
'''
load_dotenv()
ES_HOST = os.getenv('ES_HOST')
EXTERNAL_SCRAPE_INDEX_NAME = os.getenv("EXTERNAL_SCRAPE_INDEX_NAME")
EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
RAG_OUTPUT_DIR = os.getenv('RAG_OUTPUT_DIR')
RAG_OUTPUT_FILENAME = os.getenv('RAG_OUTPUT_FILENAME')
FACTCHECK_LLM = OllamaLLM(model="llama3.2")
ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER = os.getenv('ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER')
ESG_REPORT_VAL_AGAINST_EXT_DATA_FILENAME = os.getenv('ESG_REPORT_VAL_AGAINST_EXT_DATA_FILENAME')

if not os.path.exists(ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER):
    os.makedirs(ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER)

try:
    ES = Elasticsearch(ES_HOST)
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

validation_lst = []
esg_report_json_data = obtain_esg_report_json_data(RAG_OUTPUT_DIR, RAG_OUTPUT_FILENAME)
for company, dict_of_yearly_res in esg_report_json_data.items():
    for year, dict_of_metric_res in dict_of_yearly_res.items():
        for metric, dict_of_info in dict_of_metric_res.items():
            llm_response, company, year = \
                dict_of_info['llm_response'] \
                ,dict_of_info['retrieved_company_name'] \
                , dict_of_info['retrieved_report_year']
            if llm_response == 'No relevant data available.':
                continue
            esg_report_fact = f"{company} {metric} is {llm_response}"
            lab, confidence_score, combined_text = fact_check(FACTCHECK_LLM, ES, EXTERNAL_SCRAPE_INDEX_NAME, EMBEDDING_MODEL, esg_report_fact)
            validation_lst.append([company, year, metric, esg_report_fact, combined_text, lab, confidence_score])

validation_df = pd.DataFrame(validation_lst, columns = ['company', 'year', 'metric', 
                                                        'llm_response_from_esg_report', 
                                                        'external_data', 'is_factually_true', 'confidence_score'])

validation_df.to_csv(f'{ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER}/{ESG_REPORT_VAL_AGAINST_EXT_DATA_FILENAME}.csv', index = False)