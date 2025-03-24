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
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

#%%
# ================ Load the environmental variables ================
load_dotenv()
index_name = os.getenv('ES_INDEX_NAME')

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
# ================ Setup Parameters and LLM ================
# Define the top k results to retrieve for each search
lexical_top_k = 3
semantic_top_k = 3

# Setup Prompt Template for LLM
template = """
You are an AI Chatbot that specializes in ESG analysis. 
Your task is to answer user's queries about ESG metrics to the best of your ability based on the information from the retrieved context below.
The retrieved context is a text snippet from a company's ESG report.
If the answer is not in the context provided, respond with "I don't know" and provide other relevant useful information from the context that might be of interest to the user.

User's Query: {user_query}
Context: {context}
"""

prompt = PromptTemplate(template=template, input_variables=["user_query", "context"])

# Initialize the LLM model
llm = OllamaLLM(model='llama3.2')

# Define a RAG chain
rag_chain = prompt | llm | StrOutputParser()

#%%
# ================ Create Chatbot Endpoint ================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class ChatMessage(BaseModel):
    sender: str
    text: str
    timestamp: str = None

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

# Define what happens when a POST request is made to the `/chatbot` URL/endpoint
# which will run the `chatbot()` function with the user's query and return the LLM's response
# We need to pass a query as a parameter to the endpoint using `?question=...` in the URL
# So its something like ".../chatbot?question='What is the GHG emissions of Citigroup in 2022?'"
@app.post("/chatbot")
def chatbot(req: ChatRequest):
    question = req.message
    chat_history = req.history

    history_context = "\n".join(
        [f"{msg.sender}: {msg.text}" for msg in chat_history]
    )

    # Perform hybrid search
    search_results = hybrid_search(question, lexical_top_k, semantic_top_k)

    # Get the top retrieved context from the search results
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

    combined_context = f"{history_context}\n\n{retrieved_context}"

    # Feed the retrieved context and user's query to the RAG chain
    response = rag_chain.invoke({"user_query": question, "context": combined_context})

    # Create a dictionary with the LLM response and other relevant information
    response_dict = {
        "retrieved_context": retrieved_context,
        "llm_response": response,
        "retrieved_company_name": retrieved_company_name,
        "retrieved_report_year": retrieved_report_year,
        "source_path": source_path_actual,
        "page_number": page_number
    }

    # Convert the dictionary to a JSON response
    return json.dumps(response_dict, indent=4)


# ================ To Test the Chatbot Endpoint API ================
# Make sure you have pip installed the required packages: `fastapi`, `uvicorn` which are all in the `requirements.txt` file
# Open a terminal an `cd` into the directory where this file is located

# Run the following command to start the FastAPI server
# uvicorn chatbot_endpoint:app --reload
# `uvicorn` is the ASGI server that will run the FastAPI app
# `chatbot_endpoint:app` specifies the file name and the FastAPI app instance
# `--reload` flag will automatically reload the server when changes are made to the code (i.e. hot-reloading; optional)

# Once the server is running, open Postman or a web browser and make a POST request to the following URL
# http://localhost:8000/chatbot?question='What is the GHG emissions of Citigroup in 2022?'

#%%