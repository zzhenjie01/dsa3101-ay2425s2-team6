### MAIN FILE TO EXECUTE ENTIRE PIPELINE

# import necessary packages
import os
import pandas as pd
from datetime import datetime, timedelta
from scrape import scrape_newsapi
from clean import extract_body_content, clean_body_content
from elastic import create_index, index_data_to_elasticsearch, get_embeddings
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
from tqdm import tqdm
import requests
import random
from time import sleep
from sentence_transformers import SentenceTransformer
from parse import parse_with_ollama
from verification import verify_fact
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

# directory and file paths
save_dir = r"C:\Users\jiayi\OneDrive - National University of Singapore\Desktop\WebScraper without UI"
csv_file = os.path.join(save_dir, "esg_articles_w_embeddings.csv")

# initialize sentence transformer for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2') # same model as ESG reports
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# scraping, cleaning, and indexing
def scrape_and_index():
    """Main function to scrape, clean, and index articles."""
    # set date range for scraping (last 30 days)
    start_date = datetime.now() - timedelta(days=30)
    end_date = datetime.now()

    # scrape articles
    titles, sources, urls = scrape_newsapi(start_date, end_date)

    # initialize the Elasticsearch client on port 9200
    try:
        es = Elasticsearch(os.getenv('ES_HOST', 'http://localhost:9200'))
    except Exception as e:
        raise Exception(
            status_code=500, detail=f"Failed to connect to Elasticsearch: {str(e)}"
        )
    
    # create the index in Elasticsearch
    create_index(es)

    # list to store the cleaned content
    text = []
    embeddings = []

    print("\n🔍 Scraping Full News Content...")

    # loop through each URL and fetch the article content
    for url in tqdm(urls):
        try:
            response = requests.get(url)
            if response.status_code != 200:
                text.append("Unable to scrape text")
                embeddings.append(None)
                continue

            html = response.text
            raw_content = extract_body_content(html)  # extract body content
            cleaned = clean_body_content(raw_content)  # clean the extracted content

            # append cleaned content to the list
            text.append(cleaned if cleaned else "Content Not Found")

            # generate embeddings for the content
            if cleaned:
                embedding = get_embeddings(cleaned) 
                embeddings.append(embedding)
            else:
                embeddings.append(None)

            # sleep between requests to avoid hitting the API too quickly
            sleep(random.uniform(2, 5))

        except Exception as e:
            text.append("Failed to Scrape")
            embeddings.append(None)
            continue

    # check lengths
    assert len(titles) == len(sources) == len(urls) == len(text), "List Lengths Do Not Match!"

    # create a df with the scraped and cleaned data
    scraped_text_df = pd.DataFrame({
        "Title": titles,
        "Source": sources,
        "URL": urls,
        "Content": text,
        "Embeddings": embeddings 
    })

    # if the CSV file exists, append new data
    if os.path.exists(csv_file):
        print("✅ Existing CSV Found. Appending Data...")
        existing_df = pd.read_csv(csv_file)
        scraped_text_df = pd.concat([existing_df, scraped_text_df], ignore_index=True)
        scraped_text_df = scraped_text_df.drop_duplicates(subset="URL", keep="first")
        print(f"{len(scraped_text_df) - len(existing_df)} New Articles Appended")
    else:
        print("🚨 No Existing CSV Found... Creating New CSV")

    # save scraped data into the CSV file
    scraped_text_df.to_csv(csv_file, index=False, encoding="utf-8-sig")
    print(f"✅ Data Saved to {csv_file}")

    # Initialize FAISS index
    df = scraped_text_df.dropna(subset=["Embeddings"])
    df["Embeddings"] = df["Embeddings"].apply(eval)
    faiss_index = FAISS.from_embeddings(df["Embeddings"].tolist(), df["Content"].tolist(), embedding_model)
    retriever = faiss_index.as_retriever(search_kwargs={"k": 5})

    # index the data into Elasticsearch
    index_data_to_elasticsearch(scraped_text_df, es)

    # example verification
    fact = "DBS reduced its GHG Emissions by 20 percent in 2023."
    result = verify_fact(fact, retriever)
    print(result)

# run code for scraping, cleaning & indexing into Elasticsearch
if __name__ == '__main__':
   scrape_and_index()

