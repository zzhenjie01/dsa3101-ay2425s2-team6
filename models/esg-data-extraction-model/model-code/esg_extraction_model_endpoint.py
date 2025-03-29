from elasticsearch import Elasticsearch
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from model_elasticsearch_functions import hybrid_search, obtain_relevant_fields_from_context_chunk
from chatbot_functions import generate_chatbot_repsonse, ChatRequest
from metric_extraction_functions import MetricRequest, generate_esg_metric_response, \
    parse_llm_output
from qna_functions import Question, generate_qna_repsonse

# ================ Load the environmental variables ================
load_dotenv()
ES_HOST = os.getenv('ES_HOST')
INDEX_NAME = os.getenv('ES_INDEX_NAME')

# ================ Start the Elasticsearch client ================
# Initialize local Elasticsearch on port 9200
# Can also check manually that service is running by typing http://localhost:9200/ in browser
try:
    ES = Elasticsearch(ES_HOST)
except Exception as e:
    raise Exception(
        status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
    )

# ================ Parameters for hybrid search ================
# Load a pretrained embeddings model for RAG
# Used this instead of the OLlama embeddings as this one produces dense embeddings
# which are more suitable for the task of semantic search
# Initialize S-BERT model
EMBEDDING_MODEL = SentenceTransformer('all-MiniLM-L6-v2')
# Define the top k results to retrieve for each search
LEXICAL_TOP_K = 3
SEMANTIC_TOP_K = 3

# ================ Create Chatbot Endpoint ================

def generate_response_dict(retrieved_context, response, company_name, report_year, source_path_actual, page_number):
    return {
        "retrieved_context": retrieved_context,
        "llm_response": response,
        "retrieved_company_name": company_name,
        "retrieved_report_year": report_year,
        "source_path": source_path_actual,
        "page_number": page_number
    }

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

"=============================================================="

# Define what happens when a POST request is made to the `/chatbot` URL/endpoint
# which will run the `chatbot()` function with the user's query and return the LLM's response
# We need to pass a query as a parameter to the endpoint using `?question=...` in the URL
# So its something like ".../chatbot?question='What is the GHG emissions of Citigroup in 2022?'"
@app.post("/esg-data-extraction-model/chatbot")
def chatbot(req: ChatRequest):
    question, chat_history = req.message, req.history

    history_context = "\n".join(
        [f"{msg.sender}: {msg.text}" for msg in chat_history]
    )

    # Perform hybrid search
    search_results = hybrid_search(ES, INDEX_NAME, EMBEDDING_MODEL, question, LEXICAL_TOP_K, SEMANTIC_TOP_K)

    # Get the top retrieved context from the search results
    retrieved_chunk = search_results[0]

    retrieved_context, retrieved_company_name, retrieved_report_year, \
    source_path_actual, page_number = \
        obtain_relevant_fields_from_context_chunk(retrieved_chunk)

    combined_context = f"{history_context}\n\n{retrieved_context}"

    # Feed the retrieved context and user's query to the RAG chain
    response = generate_chatbot_repsonse(question, combined_context)

    # Create a dictionary with the LLM response and other relevant information
    response_dict = generate_response_dict(retrieved_context, response, retrieved_company_name, retrieved_report_year, source_path_actual, page_number)
    response_dict = jsonable_encoder(response_dict)

    # Convert the dictionary to a JSON response
    return JSONResponse(content=response_dict)

"=============================================================="

@app.post("/esg-data-extraction-model/extract-esg-metrics")
def esg_metrics(req: MetricRequest):
    company_name, esg_metric, report_year = \
        req.company_name, req.esg_metric, req.report_year

    search_query = f"What is {company_name}'s {esg_metric} in {report_year}?"

    # Perform hybrid search
    search_results = hybrid_search(ES, INDEX_NAME, EMBEDDING_MODEL, search_query, LEXICAL_TOP_K, SEMANTIC_TOP_K, company_name)
    # Get the top retrieved context from the search results
    retrieved_chunk = search_results[0]

    retrieved_context, retrieved_company_name, retrieved_report_year, \
    source_path_actual, page_number = \
        obtain_relevant_fields_from_context_chunk(retrieved_chunk)

    # Feed the retrieved context and user's query to the RAG chain
    response = generate_esg_metric_response(esg_metric, retrieved_context)
    response = parse_llm_output(response)
    # Create a dictionary with the LLM response and other relevant information
    response_dict = generate_response_dict(retrieved_context, response, retrieved_company_name, retrieved_report_year, source_path_actual, page_number)
    response_dict = jsonable_encoder(response_dict)

    # Convert the dictionary to a JSON response
    return JSONResponse(content=response_dict)

"=============================================================="

@app.post("/esg-data-extraction-model/question-and-answer")
def esg_metrics(req: Question):
    qn = req.question

    # Perform hybrid search
    search_results = hybrid_search(ES, INDEX_NAME, EMBEDDING_MODEL, qn, LEXICAL_TOP_K, SEMANTIC_TOP_K)
    # Get the top retrieved context from the search results
    retrieved_chunk = search_results[0]

    retrieved_context, retrieved_company_name, retrieved_report_year, \
    source_path_actual, page_number = \
        obtain_relevant_fields_from_context_chunk(retrieved_chunk)

    # Feed the retrieved context and user's query to the RAG chain
    response = generate_qna_repsonse(qn, retrieved_context)
    # Create a dictionary with the LLM response and other relevant information
    response_dict = generate_response_dict(retrieved_context, response, retrieved_company_name, retrieved_report_year, source_path_actual, page_number)
    response_dict = jsonable_encoder(response_dict)

    # Convert the dictionary to a JSON response
    return JSONResponse(content=response_dict)
