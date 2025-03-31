import json
import os
from dotenv import load_dotenv
from .esg_json_to_csv_func import generate_nlp_pipeline, convert_esg_json_to_csv

# ============ Process the JSON files using Spark NLP ============

def esg_json_to_csv(esg_reports_json_dir, esg_reports_csv_dir, spark):
    # pipeline object to process the CSV files
    pipeline = generate_nlp_pipeline()
    if not os.path.exists(esg_reports_csv_dir):
        os.makedirs(esg_reports_csv_dir)
    # Iterate over the files in the JSON directory
    for filename in os.listdir(esg_reports_json_dir):
        output_df = convert_esg_json_to_csv(esg_reports_json_dir, filename, spark, pipeline)
        output_filename = filename.replace('.json', '.csv')
        output_df.to_csv(f'{esg_reports_csv_dir}/{output_filename}', index=False)