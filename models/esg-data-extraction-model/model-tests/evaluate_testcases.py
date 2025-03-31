import pandas as pd
from dotenv import load_dotenv
from evaluate_testcases_func import evaluate_testcase, process_file
import os

load_dotenv()
ESG_MODEL_METRIC_EXTRACTION_URL = os.getenv('ESG_MODEL_METRIC_EXTRACTION_URL')
TC_FOLDER_DIR = os.getenv('TC_FOLDER_DIR')
TC_EVAL_RESULT_DIR = os.getenv('TC_EVAL_RESULT_DIR')

results = []
for filename in os.listdir(TC_FOLDER_DIR):
    task = process_file(filename, TC_FOLDER_DIR, ESG_MODEL_METRIC_EXTRACTION_URL)
    results.append(task)

pd.concat(results).to_csv(f'{TC_EVAL_RESULT_DIR}test_case_evaluation_results.csv', index = False)
    
