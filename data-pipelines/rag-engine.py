#========== WARNING ==========
# Run this script only when the Elasticsearch container is running
# Also make sure you have indexed the data into Elasticsearch before running this script
#=============================
#%%
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
import json
import re

#%%
# ================ Load the environmental variables ================
load_dotenv()
index_name = os.getenv('ES_INDEX_NAME')
ESG_REPORTS_CSV_DIR = os.getenv('ESG_REPORTS_CSV_FOLDER')
RAG_OUTPUT_DIR = os.getenv('RAG_OUTPUT_FOLDER')

# Create the output directory if it does not exist
if not os.path.exists(RAG_OUTPUT_DIR):
    os.makedirs(RAG_OUTPUT_DIR)

#%%
# ================ Start the Elasticsearch client ================
# Initialize local Elasticsearch on port 9200
# Can also check manually that service is running by typing http://localhost:9200/ in browser
try:
    es = Elasticsearch('http://localhost:9200/')
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

#%%
# ================ Load the Embeddings model ================
# Load a pretrained embeddings model for RAG
# Used this instead of the OLlama embeddings as this one produces dense embeddings
# which are more suitable for the task of semantic search
# Initialize S-BERT model
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to get embeddings using S-BERT model
def get_embeddings(text):
    try:
        # Create embeddings and convert to list from as needed by Elasticsearch
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None
    
#%%
# =============== Define Search Functions into Elasticsearch for RAG ===============

# Lexical Search Function
def lexical_search(query: str, top_k: int, input_company_name: str = None):
    '''Returns the top-k lexical search results for the given query'''

    # Base query: full-text search on `text_chunk` field
    query_body = {
    "query": {
        "bool": {
            "must": [
                {"match": {"text_chunk": query}}  # Main search in text_chunk
            ],
            "should": [
                {"match": {"tags": query}}  # Boost relevance if query appears in tags
            ],
            "filter": []  # Filtering conditions
            }
        },
    "size": top_k,
    "_source": ["text_chunk", "tags", "source_path", "company_name", "report_year"]
    }

    # Add company_name filter if provided
    if input_company_name:
        # Convert `input_company_name` to lowercase because the `company_name` field is automatically converted to lowercase in ES
        # input_company_name = input_company_name.lower()
        query_body["query"]["bool"]["filter"].append({"term": {"company_name": input_company_name}})


    # Execute lexical search
    lexical_results = es.search(index=index_name, body=query_body)

    lexical_hits = lexical_results['hits']['hits']
    max_bm25_score = max([hit["_score"] for hit in lexical_hits], default=1.0)

    # Normalize lexical scores
    for hit in lexical_hits:
        hit["_normalized_score"] = hit["_score"] / max_bm25_score

    return lexical_hits

# Semantic Search Function
def semantic_search(query: str, top_k: int, input_company_name: str = None):
    # Generate embeddings for the query using S-BERT
    query_embedding = get_embeddings(query)

    # Perform a cosine similarity search using the query embedding
    script_query = {
        "script_score": {
            "query": {"bool": {"filter": []}}, # filters will be added below
            "script": {
                "source": "cosineSimilarity(params.query_embedding, 'chunk_embedding') + 1.0", # Cosine similarity calculation
                "params": {"query_embedding": query_embedding}, # Pass the query embedding as a parameter
            },
        }
    }

    # Add filters for company_name
    if input_company_name:
        # Convert `input_company_name` to lowercase because the `company_name` field is automatically converted to lowercase in ES
        # input_company_name = input_company_name.lower()
        script_query["script_score"]["query"]["bool"]["filter"].append({"term": {"company_name": input_company_name}})

    # Execute semantic search
    semantic_results = es.search(
        index=index_name,
        body={
            "query": script_query,
            "_source": {"excludes": ["chunk_embedding"]},
            "size": top_k,
        },
        source_excludes=["chunk_embedding"],
    )

    semantic_hits = semantic_results['hits']['hits']
    max_semantic_score = max([hit["_score"] for hit in semantic_hits], default=1.0)

    # Normalize semantic scores
    for hit in semantic_hits:
        hit["_normalized_score"] = hit["_score"] / max_semantic_score

    return semantic_hits

# Combine lexical and semantic search results using Reciprocal Rank Fusion (RRF)
def reciprocal_rank_fusion(lexical_hits, semantic_hits, k=60):
    '''
    k: The rank bias parameter (higher values reduce the impact of rank).
    '''
    rrf_scores = {}

    # Process lexical search results
    for rank, hit, in enumerate(lexical_hits, start=1):
        doc_id = hit["_id"]
        score = 1 / (k + rank) # Reciprocal Rank Fusion (RRF) score
        if doc_id in rrf_scores:
            rrf_scores[doc_id]["rrf_score"] += score
        else:
            rrf_scores[doc_id] = {
                "text_chunk": hit["_source"]["text_chunk"],
                "tags": hit["_source"]["tags"],
                "source_path": hit["_source"]["source_path"],
                "report_year": hit["_source"]["report_year"],
                "company_name": hit["_source"]["company_name"],
                "lexical_score": hit["_normalized_score"],
                "semantic_score": 0,
                "rrf_score": score,
            }

    # Process semantic search results
    for rank, hit in enumerate(semantic_hits, start=1):
        doc_id = hit["_id"]
        score = 1 / (k + rank) # RRF formula
        if doc_id in rrf_scores:
            rrf_scores[doc_id]["rrf_score"] += score
            rrf_scores[doc_id]["semantic_score"] = hit["_normalized_score"]
        else:
            rrf_scores[doc_id] = {
                "text_chunk": hit["_source"]["text_chunk"],
                "tags": hit["_source"]["tags"],
                "source_path": hit["_source"]["source_path"],
                "report_year": hit["_source"]["report_year"],
                "company_name": hit["_source"]["company_name"],
                "lexical_score": 0,
                "semantic_score": hit["_normalized_score"],
                "rrf_score": score,
            }

    # Sort by the RRF score in descending order
    sorted_results = sorted(
        rrf_scores.values(), key=lambda x: x["rrf_score"], reverse=True
    )

    return sorted_results

# Hybrid Search Function
def hybrid_search(query: str, lexical_top_k: int, semantic_top_k: int, input_company_name: str = None):
    # Get lexical and semantic search results
    lexical_hits = lexical_search(query, lexical_top_k, input_company_name)
    semantic_hits = semantic_search(query, semantic_top_k, input_company_name)
    # Combine using RRF
    combined_results = reciprocal_rank_fusion(lexical_hits, semantic_hits, k=60)
    return combined_results


#%%
# ================ Define ESG Metrics and Setup Parameters ================
# Define a set of ESG metrics our group came up with 
esg_metrics = ['GHG emissions', 'Electricity consumption', \
               'Water consumption', 'Gender ratio', 'Turnover rate', \
                'Board of Director gender ratio', 'Number of Corruption cases']

# Define the top k results to retrieve for each search
lexical_top_k = 3
semantic_top_k = 3



#%%
# ================ Setting Up LLM =================
# Setup Prompt Template for LLM
template = """
You are an expert in ESG analysis. 
Based on the retrieved context and the requested ESG metric provided below, extract the value of the ESG metric from the context.
Extract only one value of the ESG metric requested.
If multiple values are found, return only the most recent one.
Do not return a list or range of values; select only one value.
If no value is explicitly stated, respond with "No relevant data available." Do not make up any numbers.

ESG Metric: {esg_metric}
Context: {context}

Ouput Requirements:
- Single value in numerical form (e.g. 1234.56) or "No relevant data available."
- If the value is a percentage, return it in numerical form with percentage symbol (e.g. 50%).
- If the value has a unit, include the unit in the response (e.g. 1000 tonnes).

Output Format:
Please provide only the ESG metric value in JSON format, with no additional explanation or text before or after the JSON object.
Ensure that the <extracted_value> is a string wrapped in double quotes.
It should be in the format:
```json
{{"value": <extracted_value>}}
```
"""

prompt = PromptTemplate(template=template, input_variables=["esg_metric", "context"])

# Initialize the LLM model
llm = OllamaLLM(model='llama3.2')

# Define a RAG chain
rag_chain = prompt | llm | StrOutputParser()


#%%
# ================= Function to parse the output from LLM =================
def parse_llm_output(llm_output):
    '''
    Purpose: Takes in raw output from LLM and returns the extracted value (ESG metric value)
    Reason: The raw output from LLM is a stringified JSON object instead of a proper JSON object
            or Python dictionary. E.g. "{\"value\": \"45%\"}". 
            And sometimes there are extra texts before and after the JSON object. 
            E.g. "Some text here. {\"value\": \"31.4%\"}\n\nMore explanation follows after the JSON."
            We only want to keep the JSON object and extract the value from it.
    Input: 
        llm_output (str): The raw output from LLM which is a stringified JSON object
    Output:
        extracted_value (str): The extracted value from the LLM output which is the ESG metric value
    '''
    # print(llm_output)

    # Use regex to capture everything from the first '{' to the corresponding '}' in the LLM output
    # This will extract the JSON object from the LLM output
    # `\{` matches the literal `{` character and escaping is necessary because `{` is a special charcter in regex
    # `.*` matches any character (except for line terminators) zero or more times
    # `\}` matches the literal `}` character and escaping is necessary because `}` is a special charcter in regex
    match = re.search(r'\{.*\}', llm_output)

    # If a match is found, extract the JSON object and convert it to a Python dictionary
    # Then extract the value from the dictionary
    if match:
        json_str = match.group(0) # `match.group(0)` returns the entire match
        python_dict = json.loads(json_str)
        extracted_value = python_dict['value']
        return extracted_value
    # If we cannot extract the value, then the default response is "No relevant data available."
    else:
        return "No relevant data available."
    


#%%
# ================= RAG Engine =================
# Loop through all the companies and for each ESG metric we perform a hybrid search
# The retrieved context from ES together with the ESG metric is passed to LLM
# to generate an evaluation
# We get the list of companies and report year from the CSV file names

def main():
    # Dictionary to store all the LLM repsonses for each company and each ESG metric
    output_dict = {}

    for filename in os.listdir(ESG_REPORTS_CSV_DIR):
        if filename.endswith('.csv'):
            # Get the company name and report year from the CSV file name
            report_year = filename.split('_')[0]
            company_name = filename.split('_')[1].replace('-', ' ')
            
            # Iterate through the ESG metrics
            for esg_metric in esg_metrics:
                # Perform a hybrid search in ES to retrieve relvant context for the ESG metric
                search_query = f"What is {company_name}'s {esg_metric} in {report_year}?"
                search_results = hybrid_search(search_query, lexical_top_k, semantic_top_k, company_name)

                # Get the top retrieved context from the search
                retrieved_chunk = search_results[0]
                retrieved_context = retrieved_chunk['text_chunk']
                # Get the retrieved context's company name and report year
                # This is mainly for checking whether the retrieved context is for the correct company and year
                retrieved_company_name = retrieved_chunk['company_name']
                retrieved_report_year = retrieved_chunk['report_year']
                # Get the source path of the retrieved context
                # It is in the format: `.../<original-pdf-name>.pdf_<page-number>`
                source_path = retrieved_chunk['source_path']
                source_path_parts = source_path.split('.pdf')
                source_path_actual = source_path_parts[0] + '.pdf'
                page_number = source_path_parts[1].replace('_', '')

                # Feed the retrieved context and ESG metric to the LLM model
                raw_response = rag_chain.invoke({"esg_metric": esg_metric, "context": retrieved_context})
                # The raw response from the LLM is a stringified JSON object instead of a proper JSON object
                # E.g. "{\"value\": \"45%\"}" instead of {"value": "45%"}
                # We need to convert the raw response to a Python dictionary and extract its value before storing
                # We ask the LLM to give us the ESG metric value in JSON format 
                # so that it will only give a single value instead of a long string of texts
                parsed_response = parse_llm_output(raw_response)

                # Create a dictionary to store the information for this iteration
                response_dict = {
                    "retrieved_context": retrieved_context,
                    "llm_response": parsed_response,
                    "retrieved_company_name": retrieved_company_name,
                    "retrieved_report_year": retrieved_report_year,
                    "source_path": source_path_actual,
                    "page_number": page_number
                }

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

            
#%%
if __name__ == '__main__':
    main()
    # Close the Elasticsearch connection to free up resources
    es.close()
    print("RAG Engine execution completed successfully.")