# necessary packages
from newsapi import NewsApiClient
from scrape import scrape_newsapi
from split import split_text
from elastic import create_index, index_documents
from query import knn_search, fact_check, combine_content
from scrape_json import get_llm_responses
from datetime import datetime, timedelta
import pandas as pd
import os
import argparse
from dotenv import load_dotenv
import csv

##### STEP 1: Use NewsAPI to scrape headlines & articles URL & Use BeautifulSoup to scrape full content

# initialize 
load_dotenv()
API_KEY = os.getenv('NEWSAPI_KEY')
newsapi = NewsApiClient(api_key=API_KEY)
save_dir = os.getenv('SAVE_DIR')

# create if directory does not exist
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

# define csv file path
current_datetime = datetime.now().strftime('%Y%m%d_%H%M%S') # current date and time
csv_file = os.path.join(save_dir, f"esg_articles_{current_datetime}.csv")

# scrap weekly till today
end_date = datetime.now()
start_date = end_date - timedelta(days=30) # since can only search articles up to 1 month old

# targeted bank names
bank_names = [
            # Global Major Banks
            "HSBC", "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", 
            "Citi", "Wells Fargo", "Bank of America",
            "BNP Paribas", "Deutsche Bank", "UBS", "Credit Suisse", 
            "Societe Generale", "Standard Chartered", "Barclays",
            
            # Asia-Pacific Banks
            "DBS", "OCBC", "UOB", "Bank of China", "ICBC", 
            "Woori Bank", "Krung Thai Bank", "Sumitomo Mitsui", 
            "Mizuho Bank", "ANZ Bank", "National Australia Bank",
            
            # Sustainable Banks
            "Triodos Bank", "Amalgamated Bank", 
            "Bank of the West", "Aspiration Bank"
        ]

def scrape():
    return scrape_newsapi(start_date, end_date, csv_file, bank_names)


##### STEP 2: Text Splitting for Manageable Chunks
def split(scraped_text_df):
    return split_text(scraped_text_df)


##### STEP 3: Generate Embeddings and Store in Elasticsearch
def store_in_elastic(all_splits):
    create_index() # ensure index created first
    index_documents(all_splits) # index documents with embeddings


##### STEP 4: Implementing Retrieval System and Fact Checking with LLM
fact_checking_file = os.path.join(save_dir, "fact_checking.csv") 

##### Save results to CSV
def save_to_csv(results, fact_checking_file):
    # ensure directory exists
    dir_name = os.path.dirname(fact_checking_file)
    if not os.path.exists(dir_name) and dir_name != '':
        os.makedirs(dir_name)

    # open factchecking file and write results
    with open(fact_checking_file, mode='w', newline='', encoding="utf-8") as file:
        writer = csv.writer(file)
        # header of csv
        writer.writerow(["Query from ESG Reports", "Combined Text From NewsAPI", "Fact-Check Result", "Confidence Score"])
        # writing data
        for result in results:
            writer.writerow(result)
    print(f"Results saved to {fact_checking_file}")

def retrieve_and_fact_check():

    # fetch all llm responses
    llm_responses = get_llm_responses()

    results = []

    # loop through all responses in the list
    for query in llm_responses: # each query is a STRING
        print(f"Running fact-checking for query: {query}")

        response = knn_search(query, "esg_articles")

        # print out top K most similar document chunks from es
        for hit in response["hits"]["hits"]:
            print(f"Title: {hit['_source']['title']}")
            print(f"URL: {hit['_source']['url']}")
            # print(f"Content:{hit['_source']['content']}")
            print(f"Similarity Score: {hit['_score']}\n") # score of how relevant/similar the content is

        # combine content from the documents
        combined_text = combine_content(response) 
        print("### Combined Page Content ###")
        print(combined_text)

        # fact-check the combined content with confidence score
        fact_check_result, confidence_score = fact_check(query, combined_text)
        print(fact_check_result)
        print(confidence_score)

        # append results for saving in csv
        results.append([query, combined_text, fact_check_result, confidence_score])

        # save results to CSV
        save_to_csv(results, fact_checking_file)

##### Run WebScraper 
# allows you to selectively run diff parts of pipelines based on needs
def main(scrape_data=False, start_date=None, end_date=None, csv_file=None, query_data=None, save_results = True):
    results = []

    # Step 1: scrape data if needed
    if scrape_data:
        print("Scraping data...")
        df = scrape()
        splits = split(df)
        store_in_elastic(splits)
    else:
        print("Skipping scraping data.")

    # Step 2: query and fact-check
    if query_data is not None:
        print(f"Running query: {query_data}")
        retrieve_and_fact_check()
    else: 
        print("Running fact-checking for all LLM responses...")
        retrieve_and_fact_check()

if __name__ == "__main__":
    # setting up command-line arguments
    parser = argparse.ArgumentParser(description="Run scraping, processing, and querying steps independently.")
    parser.add_argument("--scrape", action="store_true", help="Flag to re-scrape data.")
    parser.add_argument("--query", type=str, nargs='?', help="Query string to run fact-checking. Optional if querying LLM responses.")
    parser.add_argument("--csv_file", type=str, help="CSV file to store the scraped data.")
    
    args = parser.parse_args()

    # check if the query argument is provided
    if args.query is not None:
       query_data = args.query # assign query directly from command line argument
    else:
        query_data = None

    # call main with the appropriate flags and arguments
    main(
        scrape_data=args.scrape,
        csv_file=args.csv_file,
        query_data=query_data
    )

''' IMPORTANT NOTES FOR RUNNING THE SCRIPT

1) terminal command if just want to scrape without querying
   python main.py --scrape

2) terminal command if want to skip scraping and just query from banks' ESG reports
   python main.py --query 

3) terminal comand if want to skip scraping and write own query
   python main.py --query "Your Query Here"
    
4) terminal comment if want to scrape and query:
   python main.py --scrape --query 

'''
