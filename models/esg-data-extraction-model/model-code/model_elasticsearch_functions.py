# Function to get embeddings using S-BERT model
def get_embeddings(text, embedding_model):
    try:
        # Create embeddings and convert to list from as needed by Elasticsearch
        return embedding_model.encode(text).tolist()
    except Exception as e:
        print(f"Error fetching embeddings for text: {text}. Error: {str(e)}")
        return None

# =============== Define Search Functions into Elasticsearch for RAG ===============

# Lexical Search Function
def lexical_search(es, query: str, top_k: int, index_name: str, input_company_name: str = None):
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
        #input_company_name = input_company_name.lower()
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
def semantic_search(es, query: str, top_k: int, index_name, embedding_model, input_company_name: str = None):
    # Generate embeddings for the query using S-BERT
    query_embedding = get_embeddings(query, embedding_model)

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
    print(semantic_results)

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
def hybrid_search(es, index_name, embedding_model, query: str, lexical_top_k: int, semantic_top_k: int, input_company_name: str = None):
    # Get lexical and semantic search results
    lexical_hits = lexical_search(es, query, lexical_top_k, index_name, input_company_name)
    semantic_hits = semantic_search(es, query, semantic_top_k, index_name, embedding_model, input_company_name)
    # Combine using RRF
    print(lexical_hits)
    print(semantic_hits)
    combined_results = reciprocal_rank_fusion(lexical_hits, semantic_hits, k=60)
    return combined_results

'''
Function helps to retrieved relevant fields from the chunk
obtained from ElasticSearch to be used in the future by the 
API endpoints. It is a helper function to refactor code in API endpoint.
'''
def obtain_relevant_fields_from_context_chunk(retrieved_chunk):
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

    return retrieved_context, retrieved_company_name, \
    retrieved_report_year, source_path_actual, page_number