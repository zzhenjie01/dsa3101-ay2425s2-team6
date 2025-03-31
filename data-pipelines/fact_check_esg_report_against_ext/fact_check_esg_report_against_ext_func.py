import re
import os
import json

# Obtains data from ESG reports which was previously stored as JSON
def obtain_esg_report_json_data(rag_output_path, rag_output_filename):
    # Check if the rag_output.json file exists
    if os.path.exists(f"{rag_output_path}/{rag_output_filename}"):
        with open(f"{rag_output_path}/{rag_output_filename}", 'r') as f:
            # Load the JSON data
            data = json.load(f)
    return data

def get_embeddings(text, embedding_model):
    try:
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None
    
def knn_search(es, query, index_name, embedding_model, k = 5):
    # Converts report chunk to be evaluated into embeddings
    query_embedding = get_embeddings(query, embedding_model)

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

    # Search for top 5 best external information as context chunks for cross validation
    response = es.search(index=index_name, body=search_query)
    return response

# combine most relevant retrieved context together
def combine_content(response):
    return "\n\n".join([hit["_source"]["content"] for hit in response['hits']['hits']])

# performs fact check between report chunk and the top 5 information
def fact_check(factcheck_llm, es, index_name, embedding_model, query, confidence=True):
    retrieved_context = knn_search(es, query, index_name, embedding_model)
    combined_text = combine_content(retrieved_context)
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
        prompt += """
        Additionally, provide a confidence score from 0 to 100 as part of the response.
        Format the output as: <label>_<confidence_percentage> (e.g., yes_95%)
        """

    response = factcheck_llm.invoke(prompt).strip()

    response = response.split("\n")[0]  # In case LLM gives extra text
    response = response.capitalize()  # Force consistent casing

    # Extracting confidence score
    match = re.match(r"(\w+)_([0-9]+)%", response)
    if match:
        label = match.group(1)
        confidence_score = int(match.group(2))
    else:
        label = response
        confidence_score = None

    return label, confidence_score, combined_text