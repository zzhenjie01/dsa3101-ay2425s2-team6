#========== WARNING ==========
# Run this script only when the Elasticsearch container is running
#=============================
#%%
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import pandas as pd
from elasticsearch import helpers

#%%
# ================ Load the environmental variables ================
load_dotenv()
ESG_REPORTS_CSV_DIR = os.getenv('ESG_REPORTS_CSV_FOLDER')
index_name = os.getenv('ES_INDEX_NAME')

#%%
# ================ Define Elasticsearch index mappings ================
# For `tags` we use `text`` data type insted of 'keyword' data type
# because according to official Elasticsearch documentation,
# 'keyword' datatype is used when you require and exact value search like zip codes etc
# But in our case, our tags are a string of keywords separated by commas.
# The embeddings field is a dense vector of 384 dimensions because we
# are using 'all-MiniLM-L6-v2' emebedding model which produces vectors of 384 dimensions
# The embedding is obtained by passing the `text_chunk` through the embedding model

index_mapping = {
    "properties": {
        "text_chunk" : {"type" : "text", "analyzer": "standard"},
        "tags": {"type": "keyword"},
        "chunk_embedding": {
            "type": "dense_vector",
            "dims": 384,
            "similarity": "cosine"},
        "company_name": {"type": "keyword"},
        "report_year": {"type": "integer"},
        "source_path": {"type": "keyword"},
    }
}

# The following commented out code is used if don't want to use `create_index` function
# and just past it into `actions` directly

# index_mapping = {
#     "mappings": {
#         "properties": {
#         "text_chunk" : {"type" : "text", "analyzer": "standard"},
#         "tags": {"type": "keyword"},
#         "chunk_embedding": {
#             "type": "dense_vector",
#             "dims": 384,
#             "similarity": "cosine"},
#         "company_name": {"type": "keyword"},
#         "report_year": {"type": "integer"},
#         "source_path": {"type": "keyword"},
#         }
#     }
# }

#%%
# ================ Connect to Elasticsearch ================
# Initialize local Elasticsearch on port 9200
# Can also check manually that service is running by typing http://localhost:9200/ in browser
try:
    es = Elasticsearch('http://localhost:9200/')
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

#%%
# ================ Load Embedding Model ================
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
# =============== Create Elasticsearch index ===============
# Create Elasticsearch index with mappings
def create_index():
    try:
        # Delete index if it already exists
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)
        # Create index with mapping
        es.indices.create(index=index_name, mappings=index_mapping)
        print(f"Index '{index_name}' created successfully!")
    except Exception as e:
        print(f"Error creating index '{index_name}': {str(e)}")

# Function call to create index
create_index()

#%%
# =============== Indexing the CSV data into Elasticsearch ===============

def main():
    # Loop through all the CSV files in the `ESG_REPORTS_CSV_DIR`
    for filename in os.listdir(ESG_REPORTS_CSV_DIR):
        if filename.endswith('.csv'):
            # Load the CSV file into a pandas DataFrame
            df = pd.read_csv(f'{ESG_REPORTS_CSV_DIR}/{filename}')

            # Drop any rows with null values
            df = df.dropna()

            # Get the filename from the CSV file path
            # Split the filename by `_` and the first element is the year
            # The second element is the company name and we remove the hypen from the name
            report_year = filename.split('_')[0]
            company_name = filename.split('_')[1].replace('-', ' ')

            # Convert data into Elasticsearch format
            actions = [
                {
                    "_index": index_name,
                    "id": row['id'],
                    "_source": {
                        "text_chunk": row['text_chunk'],
                        "tags": row['tags'],
                        "chunk_embedding": get_embeddings(row['text_chunk']),
                        "company_name": company_name,
                        "report_year": report_year,
                        "source_path": row['id'],
                    }
                }
                for _, row in df.iterrows()
            ]

            # Bulk index the data into Elasticsearch
            helpers.bulk(es, actions)
            # print(f"Data indexed successfully for '{filename}'!")
    # print("Data indexed successfully!") 

#%%
if __name__ == '__main__':
    main()
