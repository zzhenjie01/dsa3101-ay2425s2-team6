from bs4 import BeautifulSoup
import requests
import re
from time import sleep
import random
import pandas as pd
import os
import requests

def urls_given_by_newsapi_by_bankname(newsapi, start_date, end_date, bank_name):
    query = f'{bank_name} AND esg' # both bank_name and esg must appear in the article
    all_URLs = []
    all_titles = []
    all_sources = []
    session = requests.Session()
    session.timeout = 10
    data = newsapi.get_everything(q = query,
                                    from_param=start_date,
                                    to=end_date,
                                    language='en', # needs to be english articles
                                    page_size=100) # number of results to return per page
    articles = data.get("articles", [])
    for article in articles:
        if article["url"] not in all_URLs:
            all_URLs.append(article["url"])
            all_titles.append(article["title"])
            all_sources.append(article["source"])
    return list(zip(all_URLs, all_titles, all_sources))

def bs4_scrape_by_bankname_into_csv(newsapi, start_date, end_date, 
                                    bank_name, external_esg_data_csv_folder_dir):
    # get full text content from scraped news articles URL
    res = []
    if not os.path.exists(external_esg_data_csv_folder_dir):
        os.makedirs(external_esg_data_csv_folder_dir)
    for url, title, src in urls_given_by_newsapi_by_bankname(newsapi, start_date, end_date, bank_name):
        row = [title, src, url]
        try:
            response = requests.get(url)  
            if response.status_code != 200: # req unsuccessful
                row.append("Unable to scrape text")  # fill missing text
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
                row.append(content.get_text(strip=True))
            else:
                row.append("Content Not Found")  # HTML patterns failed

            sleep(random.uniform(2, 5))  # sleep to avoid detection

        except Exception as e:
            row.append("Failed to Scrape")  # for any unknown exception
            continue
        res.append(row)
    df = pd.DataFrame(res, columns = ['Title', 'Source', 'URL', 'Content'])
    df.to_csv(f'{external_esg_data_csv_folder_dir}/scraped_data_{bank_name}_{start_date}_to_{end_date}.csv', index = False)
    return df