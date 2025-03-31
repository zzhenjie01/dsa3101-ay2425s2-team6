#========== WARNING ==========
# Run this script only when the Elasticsearch container is running
#=============================
#%%
import os
import pandas as pd
from elasticsearch import helpers


#%%
# ================ Define Elasticsearch index mappings ================
# For `tags` we use `text`` data type instead of 'keyword' data type
# because according to official Elasticsearch documentation,
# 'keyword' datatype is used when you require and exact value search like zip codes etc
# But in our case, our tags are a string of keywords separated by commas.
# The embeddings field is a dense vector of 384 dimensions because we
# are using 'all-MiniLM-L6-v2' emebedding model which produces vectors of 384 dimensions
# The embedding is obtained by passing the `text_chunk` through the embedding model

# Function to get embeddings using S-BERT model
def get_embeddings(text, embedding_model):
    try:
        # Create embeddings and convert to list from as needed by Elasticsearch
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None
    
#%%
# =============== Create Elasticsearch index ===============
# Create Elasticsearch index with mappings
def create_index(es, index_name, index_mapping):
    try:
        # Delete index if it already exists
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)
        # Create index with mapping
        es.indices.create(index=index_name, mappings=index_mapping)
        print(f"Index '{index_name}' created successfully!")
    except Exception as e:
        print(f"Error creating index '{index_name}': {str(e)}")
#%%
# =============== Function uploads 1 CSV file into ElasticSearch ===============
# 1 ESG report at a time
def upload_one_csv_to_elasticsearch(esg_reports_csv_dir, filename, es, es_idx_name, embedding_model):
        if filename.endswith('.csv'):
            # Load the CSV file into a pandas DataFrame
            df = pd.read_csv(f'{esg_reports_csv_dir}/{filename}')

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
                    "_index": es_idx_name,
                    "id": row['id'],
                    "_source": {
                        "text_chunk": row['text_chunk'],
                        "tags": row['tags'],
                        "chunk_embedding": get_embeddings(row['text_chunk'], embedding_model),
                        "company_name": company_name.lower(),
                        "report_year": report_year,
                        "source_path": row['id'],
                    }
                }
                for _, row in df.iterrows()
            ]

            # Bulk index the data into Elasticsearch
            helpers.bulk(es, actions) 

#%%
# =============== Function uploads all CSV files into ElasticSearch ===============
# uploads all CSV files present into ElasticSearch
def esg_csv_to_elasticsearch(esg_reports_csv_dir, es, es_idx_name, embedding_model):
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
    # Function call to create index
    create_index(es, es_idx_name, index_mapping)
    for filename in os.listdir(esg_reports_csv_dir):
        upload_one_csv_to_elasticsearch(esg_reports_csv_dir, filename, es, es_idx_name, embedding_model)
