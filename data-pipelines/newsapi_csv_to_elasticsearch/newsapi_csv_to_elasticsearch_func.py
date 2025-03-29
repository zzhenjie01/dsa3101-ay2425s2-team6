import os
import pandas as pd
from elasticsearch import helpers
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document

# Function to get embeddings using S-BERT model
def get_embeddings(text, embedding_model):
    try:
        # Create embeddings and convert to list from as needed by Elasticsearch
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None

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

def upload_one_csv_to_elasticsearch(external_data_csv_dir, filename, es, es_idx_name, embedding_model):
        if filename.endswith('.csv'):
            # Load the CSV file into a pandas DataFrame
            df = pd.read_csv(f'{external_data_csv_dir}/{filename}')

            # do not process if CSV file is empty

            if df.shape[0] == 0: return
            # Drop any rows with null values
            df = df.dropna()
            documents = []

            for index, row in df.iterrows():
                # check if content is valid (not NaN or 'Unable to scrape text')
                if pd.notna(row['Content']) and row['Content'] != 'Unable to scrape text':
                    document = Document(page_content=row['Content'], metadata={'title': row['Title'], 'source': row['Source'], 'url': row['URL']})
                    documents.append(document) # append to documents list

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=200, chunk_overlap=20
            )
            all_splits = text_splitter.split_documents(documents) # all_splits now contains the chunked text content
            _, _, company_name, start_date, _, end_date = filename.split("_") 
            # Convert data into Elasticsearch format
            actions = [
                {
                    "_index": es_idx_name,
                    "_source": {
                        "title": doc.metadata['title'],
                        "source": doc.metadata['source'],
                        "url": doc.metadata['url'],
                        "content": doc.page_content,
                        "embeddings": get_embeddings(doc.page_content, embedding_model),
                        "company_name": company_name.lower(),
                        "start_date": start_date,
                        "end_date": end_date
                    }
                }
                for doc in all_splits
            ]

            # Bulk index the data into Elasticsearch
            helpers.bulk(es, actions)

def external_data_csv_to_elasticsearch(external_data_csv_dir, es, es_idx_name, embedding_model):
    index_mapping = {
        "properties": {
            "title": {"type": "text", "analyzer": "standard"},
            "source": {"type": "text", "analyzer": "standard"},
            "url": {"type": "text", "analyzer": "standard"},
            "content": {"type": "text", "analyzer": "standard"},
            "embeddings": {
                "type": "dense_vector",
                "dims": 384,  # The dimension of your embeddings, make sure this matches
                "similarity" : "cosine"
            },
            "company_name": {"type": "keyword"},
            "start_date": {"type": "text", "analyzer": "standard"},
            "end_date": {"type": "text", "analyzer": "standard"}
        }
    }
    # Function call to create index
    create_index(es, es_idx_name, index_mapping)
    for filename in os.listdir(external_data_csv_dir):
        upload_one_csv_to_elasticsearch(external_data_csv_dir, filename, es, es_idx_name, embedding_model)