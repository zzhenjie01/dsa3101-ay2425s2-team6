##### STANDALONE MAIN.PY
##### CODE JUST FOR SCRAPING AND STORING IN ELASTICSEARCH (FOR AUTOMATION)

import os
import logging
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
import random
from time import sleep
from tqdm import tqdm
from newsapi import NewsApiClient
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from elasticsearch import Elasticsearch, helpers
from sentence_transformers import SentenceTransformer

# Set up logging
logging.basicConfig(filename="scraper.log", level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logging.info("Script started")

# initialize with NewsAPI key
API_KEY = '37439fc0e11546dd9b81a6f698800573'
newsapi = NewsApiClient(api_key=API_KEY)

# Date Range Configuration
end_date = datetime.now()
start_date = end_date - timedelta(days=30)
date_ranges = pd.date_range(start=start_date, end=end_date, freq='7D')

# directory and file paths
save_dir = r"C:\Users\jiayi\OneDrive - National University of Singapore\Desktop\DSA3101"
csv_file = os.path.join(save_dir, "esg_articles.csv")

# Scrape NewsAPI for URLs
logging.info("Scraping URLs from NewsAPI...")
all_sources, all_URLs, all_titles = [], [], []

for i in tqdm(range(len(date_ranges) - 1)):
    from_date, to_date = date_ranges[i].strftime("%Y-%m-%d"), date_ranges[i + 1].strftime("%Y-%m-%d")
    try:
        data = newsapi.get_everything(q='esg', from_param=from_date, to=to_date, language='en', page_size=100)
        for article in data.get("articles", []):
            if article["url"] not in all_URLs:
                all_URLs.append(article["url"])
                all_titles.append(article["title"])
                all_sources.append(article["source"]["name"])
        sleep(random.uniform(3, 8))
    except Exception as e:
        logging.error(f"API failed on {from_date} to {to_date}: {e}")
        sleep(10)

logging.info(f"Total URLs Scraped: {len(all_URLs)}")

# Scrape full content
logging.info("Scraping full news content...")
text = []
for url in tqdm(all_URLs):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            text.append("Unable to scrape text")
            continue
        soup = BeautifulSoup(response.text, "html.parser")
        content = soup.find("div", {"id": re.compile("^content-body-[0-9]+")}) or \
                  soup.find("article") or \
                  soup.find("div", {"class": re.compile(".*content.*")}) or \
                  soup.find("p")
        text.append(content.get_text(strip=True) if content else "Content Not Found")
        sleep(random.uniform(2, 5))
    except Exception as e:
        text.append("Failed to Scrape")
        logging.error(f"Failed to scrape {url}: {e}")

# Save scraped data to CSV
scraped_text_df = pd.DataFrame({"Title": all_titles, "Source": all_sources, "URL": all_URLs, "Content": text})
if os.path.exists(csv_file):
    existing_df = pd.read_csv(csv_file)
    scraped_text_df = pd.concat([existing_df, scraped_text_df], ignore_index=True).drop_duplicates(subset="URL")
    logging.info(f"Appended {len(scraped_text_df) - len(existing_df)} new articles.")
scraped_text_df.to_csv(csv_file, index=False, encoding="utf-8-sig")
logging.info("Data saved to CSV")

# Load CSV and split text
df = pd.read_csv(csv_file)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=100, add_start_index=True)
documents = [Document(page_content=row['Content'], metadata={'title': row['Title'], 'source': row['Source'], 'url': row['URL']})
             for _, row in df.iterrows() if pd.notna(row['Content']) and row['Content'] != 'Unable to scrape text']
all_splits = text_splitter.split_documents(documents)

# Elasticsearch Configuration
ES_HOST = "http://localhost:9200"
index_name = "esg_articles"
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
try:
    es = Elasticsearch([ES_HOST])
    es.indices.delete(index=index_name, ignore=[400, 404])
    es.indices.create(index=index_name, mappings={
        "properties": {
            "title": {"type": "text", "analyzer": "standard"},
            "source": {"type": "keyword"},
            "url": {"type": "keyword"},
            "content": {"type": "text", "analyzer": "standard"},
            "embeddings": {"type": "dense_vector", "dims": 384, "similarity": "cosine"}
        }
    })
    logging.info("Elasticsearch index created successfully.")
except Exception as e:
    logging.error(f"Failed to connect to Elasticsearch: {e}")
    exit(1)

# Index Documents
logging.info("Indexing documents...")
def generate_documents_with_embeddings():
    for doc in all_splits:
        yield {"_index": index_name,
               "_source": {"title": doc.metadata['title'],
                            "source": doc.metadata['source'],
                            "url": doc.metadata['url'],
                            "content": doc.page_content,
                            "embeddings": embedding_model.encode(doc.page_content).tolist()}}
try:
    success, failed = helpers.bulk(es, generate_documents_with_embeddings())
    logging.info(f"Successfully indexed {success} documents. Failed to index {failed}.")
except Exception as e:
    logging.error(f"Indexing failed: {e}")

logging.info("Script completed successfully.")
