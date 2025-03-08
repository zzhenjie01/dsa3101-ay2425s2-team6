from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer
from elasticsearch.helpers import bulk

ES_HOST = "http://localhost:9200"
index_name = "esg_articles"

# initialize local es
try:
    es = Elasticsearch([ES_HOST])
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

# initialize sentence transformer for embeddings
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # same model as ESG reports

def create_index():
    """Create an Elasticsearch index for storing ESG articles."""
    
    # ensure index in elasticsearch is create w correct mapping - stored as dense_vector
    index_mapping = {
        "properties": {
            "title": {"type": "text", "analyzer": "standard"},
            "source": {"type": "keyword"},
            "url": {"type": "keyword"},
            "content": {"type": "text", "analyzer": "standard"},
            "embeddings": {
                "type": "dense_vector",
                "dims": 384,  # The dimension of your embeddings, make sure this matches
                "similarity" : "cosine"
            },
        }
    }

    try:
       # Delete index if it already exists
        if es.indices.exists(index=index_name):
            es.indices.delete(index=index_name)
        # Create index with mapping
        es.indices.create(index=index_name, mappings=index_mapping)
        print(f"Index '{index_name}' created successfully!")
    except Exception as e:
        print(f"Error creating index '{index_name}': {str(e)}") 

def generate_documents_with_embeddings(all_splits):
    """Index the processed article chunks into Elasticsearch with embeddings."""
    for doc in all_splits:
        action = {
            "_index": index_name,
            "_source": {
                "title": doc.metadata['title'],
                "source": doc.metadata['source'],
                "url": doc.metadata['url'],
                "content": doc.page_content,
                "embeddings": embedding_model.encode(doc.page_content).tolist()
            }
        }
        yield action  

def index_documents(all_splits):
    success, failed = bulk(es, generate_documents_with_embeddings(all_splits))
    print(f"Successfully indexed {success} documents. Failed to index {failed} documents.")

def get_embeddings(text):
    try:
        # Create embeddings and convert to list from as needed by Elasticsearch
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None 

