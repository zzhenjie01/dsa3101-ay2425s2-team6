### MAIN FILE TO EXECUTE ENTIRE PIPELINE

# necessary packages
from newsapi import NewsApiClient
from scrape import scrape_newsapi
from split import split_text
from elastic import create_index, index_documents
from query import knn_search, fact_check, combine_content
from datetime import datetime, timedelta
import pandas as pd
import os
import argparse

##### STEP 1: Use NewsAPI to scrape headlines & articles URL & Use BeautifulSoup to scrape full content

# initialize with NewsAPI key
API_KEY = '37439fc0e11546dd9b81a6f698800573'
newsapi = NewsApiClient(api_key=API_KEY)

# scrap weekly till today
end_date = datetime.now()
start_date = end_date - timedelta(days=30) # since can only search articles up to 1 month old 

# directory and file paths
save_dir = r"C:\Users\jiayi\OneDrive - National University of Singapore\Desktop\DSA3101"
csv_file = os.path.join(save_dir, "esg_articles.csv")

def scrape():
    return scrape_newsapi(start_date, end_date, csv_file)


##### STEP 2: Text Splitting for Manageable Chunks
def split(scraped_text_df):
    return split_text(scraped_text_df)


##### STEP 3: Generate Embeddings and Store in Elasticsearch
def store_in_elastic(all_splits):
    create_index() # ensure index created first
    index_documents(all_splits) # index documents with embeddings


##### STEP 4: Implementing Retrieval System and Fact Checking with LLM
def retrieve_and_fact_check(query):
    response = knn_search(query, "esg_articles")

    # print out top K most similar document chunks from es
    for hit in response["hits"]["hits"]:
        print(f"Title: {hit['_source']['title']}")
        print(f"URL: {hit['_source']['url']}")
        # print(f"Content:{hit['_source']['content']}")
        print(f"Similarity Score: {hit['_score']}\n") # score of how relevant/similar the content is

    combined_text = combine_content(response) 
    print("### Combined Page Content ###")
    print(combined_text)

    return fact_check(query, combined_text)

##### Run WebScraper 
# allows you to selectively run diff parts of pipelines based on needs
def main(scrape_data=False, start_date=None, end_date=None, csv_file=None, query_data=None):
    
    # Step 1: scrape data if needed
    if scrape_data:
        print("Scraping data...")
        df = scrape()
        splits = split(df)
        store_in_elastic(splits)
    else:
        print("Skipping scraping data.")

    # Step 2: query and fact-check
    if query_data:
        print(f"Running query: {query_data}")
        result = retrieve_and_fact_check(query_data)
        print("Fact-Check Result:", result)
    else:
        print("No query provided.")


if __name__ == "__main__":
    # setting up command-line arguments
    parser = argparse.ArgumentParser(description="Run scraping, processing, and querying steps independently.")
    parser.add_argument("--scrape", action="store_true", help="Flag to re-scrape data.")
    parser.add_argument("--query", type=str, help="Query string to run fact-checking.")
    #parser.add_argument("--start_date", type=str, help="Start date for scraping data (YYYY-MM-DD).")
    #parser.add_argument("--end_date", type=str, help="End date for scraping data (YYYY-MM-DD).")
    parser.add_argument("--csv_file", type=str, help="CSV file to store the scraped data.")

    args = parser.parse_args()

    # call main with the appropriate flags and arguments
    main(
        scrape_data=args.scrape,
        #start_date=args.start_date,
        #end_date=args.end_date,
        csv_file=args.csv_file,
        query_data=args.query
    )

# e.g., terminal command if want to skip scraping and just query
    # python main.py --query "FHS World 2025 mark 20 years in the UAE for the region’s most influential hospitality and tourism investment event." --csv_file "esg_articles.csv"
    
# e.g., terminal comment if want to scrape and query:
    # python main.py --scrape --query "FHS World 2025 mark 20 years in the UAE for the region’s most influential hospitality and tourism investment event." --csv_file "esg_articles.csv"

