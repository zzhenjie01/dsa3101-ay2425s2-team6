### RETRIEVAL SYSTEM & LLM FACT CHECKING

from langchain_ollama.llms import OllamaLLM
from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
from elastic import get_embeddings

ES_HOST = "http://localhost:9200"
index_name = "esg_articles"

# initialize local es
try:
    es = Elasticsearch([ES_HOST])
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')  # same model as ESG reports

def generate_query_embedding(query):
    return embedding_model.encode(query).tolist()

def knn_search(query, index_name, k=5):
    query_embedding = get_embeddings(query)

    search_query = {
        "size": k,
        "query": {
            "knn": {
                "field": "embeddings",  
                "query_vector": query_embedding,
                "k": k,
                "num_candidates": 100  # pre-select top 100 documents
            }
        },
        "_source": ["title", "url", "content"]  # return these fields
    }

    response = es.search(index=index_name, body=search_query)
    return response

# combine most relevant content together
def combine_content(response):
    combined_content = ""
    for hit in response['hits']['hits']:
        content = hit["_source"]["content"]
        combined_content += content + "\n\n" # add line btw articles
    return combined_content 

# generate responses with llm
llm = OllamaLLM(model="llama3.1")

def fact_check(query, combined_text, confidence=False):
    if not combined_text.strip():
        return "Not Conclusive (No relevant context found)"

    prompt = f"""
    You are an expert fact-checking assistant.

    Fact: "{query}"
    Context: {combined_text}

    Compare the fact against the context.
    Classify the fact as one of the following:
    - "Yes": The context **confirms** the fact.
    - "No": The context **contradicts** the fact.
    - "Not Conclusive": The context does **not provide enough information** to confirm or contradict.

    Only return the label as output.
    """

    if confidence:
        prompt += "\nAdditionally, provide a confidence score from 0 to 100 in parentheses, e.g., Same (95%)."

    response = llm.invoke(prompt).strip()

    # Optional: Normalize the output
    response = response.split("\n")[0]  # In case LLM gives extra text
    response = response.capitalize()  # Force consistent casing

    return response
