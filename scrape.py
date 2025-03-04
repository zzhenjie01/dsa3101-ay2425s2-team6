### HANDLES SCRAPING FROM NEWSAPI

# import necessary packages
from newsapi import NewsApiClient
from datetime import datetime, timedelta
import pandas as pd
from tqdm import tqdm
from time import sleep
import random
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import re
import os

# initialize with NewsAPI key
load_dotenv()
API_KEY = os.getenv('NEWSAPI_KEY')
newsapi = NewsApiClient(api_key=API_KEY)

### SCRAPING FUNCTION
def scrape_newsapi(start_date, end_date, query="esg"):
    all_URLs = []
    all_titles = []
    all_sources = []
    date_ranges = pd.date_range(start=start_date, end=end_date, freq='7D') # scrap weekly ESG articles

    print("🔍 Scraping URLs from NewsAPI...")

    for i in tqdm(range(len(date_ranges) - 1)):
        from_date = date_ranges[i].strftime("%Y-%m-%d")
        to_date = date_ranges[i + 1].strftime("%Y-%m-%d")

        try:
            data = newsapi.get_everything(q=query,
                                          from_param=from_date,
                                          to=to_date,
                                          language='en', # needs to be english articles
                                          page_size=100)

            articles = data.get("articles", [])
            for article in articles:
                if article["url"] not in all_URLs:
                    all_URLs.append(article["url"])
                    all_titles.append(article["title"])
                    all_sources.append(article["source"]["name"])

            sleep(random.uniform(3, 8))  # human-like behavior 

        except Exception as e:
            print(f"API failed from {from_date} to {to_date}: {e}")
            sleep(10)

    print(f"✅ Total URLs Scraped: {len(all_URLs)}")
    return all_titles, all_sources, all_URLs
