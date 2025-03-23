##### TAKES LLM RESPONSE FROM BANKING & FINANCE ESG REPORTS

import json
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Get the path of the rag_output.json file from the environment variable
rag_output_path = os.getenv('RAG_OUTPUT_FILE')

# Initialize list to store llm_response values
llm_responses = []

# Check if the rag_output.json file exists
if os.path.exists(rag_output_path):
    with open(rag_output_path, 'r') as f:
        # Load the JSON data
        data = json.load(f)

    # Iterate through the data and extract llm_response values
    for year, companies in data.items():
        for company, metrics in companies.items():
            for metric, details in metrics.items():
                llm_response = details.get('llm_response', None)
                if llm_response:
                    llm_responses.append(llm_response)

    print(f"Extracted {len(llm_responses)} LLM responses.")

else:
    print(f"File {rag_output_path} does not exist.")

# return list of llm_responses
def get_llm_responses():
    return llm_responses # list containing llm responses
