### HANDLES INDEXING OF CLEANED DATA TO ELASTICSEARCH

from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import pandas as pd
import os

# load env variables
load_dotenv()
ES_HOST = os.getenv("ES_HOST")
index_name = os.getenv("ES_INDEX_NAME")

INDEX_MAPPING = {
    "properties": {
        "title": {"type": "text", "analyzer": "standard"},
        "source": {"type": "keyword"},
        "url": {"type": "keyword"},
        "content": {"type": "text", "analyzer": "standard"},
        "embeddings": {
            "type":"dense_vector",
            "dims": 384,
            "similarity": "cosine"
        },
    }
}

# load SentenceTransformer model for embeddings
embedding_model = SentenceTransformer('all-MiniLM-L6-v2') 

def get_embeddings(text):
    """Get sentence embeddings"""
    try:
        return embedding_model.encode(text).tolist() # convert to list for elasticsearch
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None

def create_index(es):
    """Create an index in Elasticsearch."""
    try:
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)  # delete the index if it exists
        es.indices.create(index=index_name, mappings=INDEX_MAPPING)
        print(f"Index '{index_name}' created successfully!")
    except Exception as e:
        print(f"Error creating index '{index_name}': {str(e)}")

def index_data_to_elasticsearch(df, es):
    """Index the scraped and cleaned data into Elasticsearch."""
    actions = [
        {
            "_index": index_name,
            "id": row['URL'],  # use URL as the unique identifier
            "_source": {
                "title": row['Title'],
                "source": row['Source'],
                "url": row['URL'],
                "content": row['Content'],
            }
        }
        for _, row in df.iterrows()
    ]
    helpers.bulk(es, actions)
    print(f"Data indexed successfully for {len(df)} articles!")
