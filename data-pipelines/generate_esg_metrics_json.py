#========== WARNING ==========
# Run this script only when the Elasticsearch container is running
# Also make sure you have indexed the data into Elasticsearch before running this script
#=============================
import os
from dotenv import load_dotenv
import json
import requests

#%%
# ================ Load the environmental variables ================
load_dotenv()
INDEX_NAME = os.getenv('REPORT_ES_INDEX_NAME')
ESG_REPORTS_CSV_FOLDER = os.getenv('ESG_REPORTS_CSV_FOLDER')
RAG_OUTPUT_DIR = os.getenv('RAG_OUTPUT_DIR')
ESG_MODEL_METRIC_EXTRACTION_URL = os.getenv('ESG_MODEL_METRIC_EXTRACTION_URL')

# Create the output directory if it does not exist
if not os.path.exists(RAG_OUTPUT_DIR):
    os.makedirs(RAG_OUTPUT_DIR)


#%%
# ================ Define ESG Metrics and Setup Parameters ================
# Define a set of ESG metrics our group came up with 
esg_metrics = ['GHG emissions', 'Electricity consumption', \
               'Water consumption', 'Gender ratio', 'Turnover rate', \
                'Board of Director gender ratio', 'Number of Corruption cases']

#%%
# ================= RAG Engine =================
# Loop through all the companies and for each ESG metric we perform a hybrid search
# The retrieved context from ES together with the ESG metric is passed to LLM
# to generate an evaluation
# We get the list of companies and report year from the CSV file names

def main():
    # Dictionary to store all the LLM repsonses for each company and each ESG metric
    output_dict = {}

    for filename in os.listdir(ESG_REPORTS_CSV_FOLDER):
        if filename.endswith('.csv'):
            # Get the company name and report year from the CSV file name
            report_year = filename.split('_')[0]
            company_name = filename.split('_')[1].replace('-', ' ').lower()
            
            # Iterate through the ESG metrics
            for esg_metric in esg_metrics:
                response_dict = requests.post(ESG_MODEL_METRIC_EXTRACTION_URL, json = {
                    "company_name": company_name,
                    "esg_metric": "GHG emissions",
                    "report_year": report_year
                }).json()


                # If the company name and report year are not in the output dictionary, create them
                if company_name not in output_dict:
                    output_dict[company_name] = {}
                if report_year not in output_dict[company_name]:
                    output_dict[company_name][report_year] = {}

                # Add the response to the output dictionary
                output_dict[company_name][report_year][esg_metric] = response_dict
                
    # Save the output dictionary to a JSON file
    output_file_path = os.path.join(RAG_OUTPUT_DIR, 'rag_output.json')
    with open(output_file_path, 'w') as f:
        json.dump(output_dict, f, indent=4)
    
    print(f"RAG Engine output saved to: {output_file_path}")

main()