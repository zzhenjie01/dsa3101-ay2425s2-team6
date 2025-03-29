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

# initialize
load_dotenv()
API_KEY = os.getenv('NEWSAPI_KEY')
newsapi = NewsApiClient(api_key=API_KEY)
save_dir = os.getenv('SAVE_DIR')

### SCRAPING FUNCTION
def scrape_newsapi(start_date, end_date, csv_file, bank_names):
    all_URLs = []
    all_titles = []
    all_sources = []
    date_ranges = pd.date_range(start=start_date, end=end_date, freq='7D') # scrap weekly ESG articles

    print("🔍 Scraping URLs from NewsAPI...")

    # loop through each week to scrape URLs and titles
    for i in tqdm(range(len(date_ranges) - 1)):
        from_date = date_ranges[i].strftime("%Y-%m-%d")
        to_date = date_ranges[i + 1].strftime("%Y-%m-%d")

        try:
            query = f'{bank_names} AND esg' # both bank_name and esg must appear in the article
            data = newsapi.get_everything(q = query,
                                          from_param=from_date,
                                          to=to_date,
                                          language='en', # needs to be english articles
                                          page_size=100) # number of results to return per page

            articles = data.get("articles", [])
            for article in articles:
                if article["url"] not in all_URLs:
                    all_URLs.append(article["url"])
                    all_titles.append(article["title"])
                    all_sources.append(article["source"])

            sleep(random.uniform(3, 8))  # human-like behavior 

        except Exception as e:
            print(f"API failed from {from_date} to {to_date}: {e}")
            sleep(10) # sleep before retrying

    print(f"✅ Total URLs Scraped: {len(all_URLs)}")
    
    print("\n🔍 Scraping Full News Content...")

    # get full text content from scraped news articles URL
    text = []
    for url in tqdm(all_URLs):
        try:
            response = requests.get(url)  
            if response.status_code != 200: # req unsuccessful
                text.append("Unable to scrape text")  # fill missing text
                continue

            soup = BeautifulSoup(response.text, "html.parser")

            # try different HTML patterns
            content = soup.find("div", {"id": re.compile("^content-body-[0-9]+")})
            if not content:
                content = soup.find("article")
            if not content:
                content = soup.find("div", {"class": re.compile(".*content.*")})
            if not content:
                content = soup.find("p")  # fallback to paragraphs

            if content:
                text.append(content.get_text(strip=True))
            else:
                text.append("Content Not Found")  # HTML patterns failed

            sleep(random.uniform(2, 5))  # sleep to avoid detection

        except Exception as e:
            text.append("Failed to Scrape")  # for any unknown exception
            continue

    # ensure that all 4 lists have same length before saving to csv
    print(len(all_URLs))
    print(len(all_titles))
    print(len(all_sources))
    print(len(text))

    # create df with scraped data
    scraped_text_df = pd.DataFrame({
        "Title": all_titles,
        "Source": all_sources,
        "URL": all_URLs,
        "Content": text,
    })

    # generate filename with the current date and time
    current_datetime = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_file = os.path.join(save_dir, f"esg_articles_{current_datetime}.csv")

    # save scraped data into the CSV file
    scraped_text_df.to_csv(csv_file, index=False, encoding="utf-8-sig")
    print(f"✅ Data Saved to {csv_file}") 

    return scraped_text_df
    
