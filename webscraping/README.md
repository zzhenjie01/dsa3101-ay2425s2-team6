# 🤖 web-scraping-for-esg-news-and-fact-checking-system

## Overview
This project focuses on building an automated system that extracts Environmental, Social, and Governance (ESG) data from external news sources and performs fact-checking against corporate sustainability reports.
The system is designed to help in verifying ESG claims made by corporations by leveraging web-scraping, Elasticsearch, and large language models (LLMs).

## 🚀 Getting Started
## 🌀 Run Data Pipeline and RAG
This section provides guidance on setting up and running the data pipeline and Retrieval-Augmented Generation (RAG) model in a single Docker container setup.
In the future, this will be integrated into a multi-container setup. 

### Pre-Requisites
Before running the project, make sure you have the following installed and configured:

- [Python 3.10.x](https://www.python.org/downloads/)
  - Python >= 3.11.x may not work well with Spark NLP since the library is poorly maintained for newer versions of Python.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Needed to run containers 
  - Certain services like Elasticsearch can only run with Docker if you want to use it locally.
  - Install Docker Desktop and make ssure that Docker is running before starting the container.
  - You can verify Docker is working by running:
  
    ```bash
    docker -- version
    ```
- [Ollama](https://ollama.com/)
  - An API to run LLMs like llamma 3.2 which we are using for this project.
- [NewsAPI](https://newsapi.org/)
  - An API to gather news articles related to ESG topics for analysis and fact-checking which we are using for this project.
  - Sign up for NewsAPI and obtain an API key to access news articles. You will need to add your API key to the `.env` file.
  

>[!NOTE]
>
>- The installation of Docker Desktop should be straightforward just by clicking the link and following the official Download instructions.


## 📁 Files and Modules

### 1.**`main.py`**
Main execution of the entire pipeline for this project. 
Coordinates the scraping, text splitting, embedding generation, and fact-checking steps. 
It allows selective execution of different parts of the pipelines via command-line arguments.

Key Functions:
- `scrape()`: Uses NewsAPI to scrape latest ESG-related articles for a list of targeted banks
- `split(scraped_text_df)`: Splits the scraped text into smaller, manageable chunks for indexing
- `store_in_elastic(all_splits)`: Creates the Elasticsearch index and indexes the document chunks
- `retrieve_and_fact_check()`: Retrieves ESG-related claims from corporate reports, queries Elasticsearch for relevant documents and fact-checks them using LLMs

>[!NOTE]
>
>- This script allows you to run different stages of the pipeline independently using command-line arguments.
>- After fact-checking, the results are saved to `fact_checking.csv`. The final CSV includes ESG Claim, Combined News Content, Fact-Check Result and Confidence Score.

### 2. **`scrape.py`**
Handles the scraping of ESG-related articles from NewsAPI.
It collects articles based on specific bank names, the keyword 'esg' and a specified date range, scraping the article title, source, URL and content.

Key Functions:
- `scrape_newsapi(start_date, end_date, csv_file, bank_names)`: Scrapes news articles for specific bank names and the keyword 'ESG', given a defined date range from NewsAPI. 
- Uses the `requests` and `BeautifulSoup` libraries to fetch full-text content from articles URLs
- Save scraped data to a CSV file
  
### 3. **`split.py`**
Splits large articles into smaller chunks for easier processing and indexing.

Key Functions:
- `split_text(scraped_text_df)`: Splits the text of scraped articles into smaller, manageable chunks for indexing

### 4. **`elastic.py`**
Responsible for interacting with Elasticsearch. Initalizes Elasticsearch, indexing articles, and performing searches on the indexed content.

Key Functions:
- `create_index()`: Creates the Elasticsearch index with the correct mappings
- `generate_documents_with_embeddings(all_splits)`: Generates the Elasticsearch actions for each documents with embeddings
- `index_documents(all_splits)`: Uses the `bulk` helper to index the documents into Elasticsearch
- `get_embeddings(text)`: Fetches embeddings for a given text using the SentenceTransformer model

### 5. **`query.py`**
Handles retrieval and fact-checking of queries using Elasticsearch and an LLM (Ollama 3.2).
Includes functions to search for similar documents in Elasticsearch using k-nearest neighbors (KNN) search and fact-checking using an LLM.

Key Functions:
- `generate_query_embedding(query)`: Generates embeddings for the query text
- `knn_search(query, index_name, k=5)`: Performs a KNN search to find the top-k most relevant documents for the query
- `combine_content(rewponse)`: Combines the content of the most relevant documents into a single text
- `fact_check(query, combined_text, confidence = True)`: Performs fact-checking on the query based on the combined context using an LLM

### 6. **`scrape_json.py`**
Handles extracting LLM-generated responses from a JSON file (`rag_output.json`)
This script loads environment variables, reads the JSON data, and retrieves `llm_response` values from the stored ESG-related insights.

Key Functions and Behavior:
- Parses `rag_output.json`: Extracts llm_response values
- Stores Extracted Data: Collect all llm_response and store them in a list called `llm_responses`

## 👉 Workflow

### 1. **Clone the Repository**

   Open terminal or Command Prompt and `cd` into your desired local directory.
  
    ```shell
    cd <desired-local-directory>
    ```
    
   Run the following `git clone` command to clone the GitHub repo to your local machine
  
    ```shell
    git clone https://github.com/zzhenjie01/dsa3101-ay2425s2-team6.git
    ```
    
### 2. **Set Up Repo Environment Variables**
   
   Open up the repo in IDE (VSCode) and create a `.env` file at the repo's root.
   Then, set the following environment variables.
   
    - `ES_INDEX_NAME`: The name of your Elasticsearch index
    - `ES_HOST`: The host URL for your Elasticsearch instance
    - `NEWSAPI_KEY`: Your API key for NewsAPI
    - `SAVE_DIR`: Directory where scraped data will be saved
    - `RAG_OUTPUT_FILE`: 
  
    ```text
    ES_INDEX_NAME = esg_articles
    ES_HOST = http://localhost:9200
    NEWSAPI_KEY = '37439fc0e11546dd9b81a6f698800573'
    SAVE_DIR = ./data 
    RAG_OUTPUT_FILE = C:\Users\jiayi\OneDrive - National University of Singapore\Desktop\WebScraper Latest\rag_output.json

    ```
  >[!IMPORTANT]
  > Notice the paths above ends with `/`. This is important as the scripts may not work correctly if you leave it out.


### 3. **Install required dependencies**
   
   Install the required dependencies by running the following in your terminal:
   
   Open up terminal and run the following:
  
    ```shell
    cd <REPO-ROOT>/webscraping
    ```
  
    ```shell
    pip install -r requirements.txt
    ``` 

### 4. **Docker Setup for Local Development**
   Elasticsearch will be run in a Docker container to handle indexing and searching of ESG-related articles. To set it up:

   Creating a Docker network for communication between containers

   ```shell 
    docker network create elastic
   ```

   Pull the Elasticsearch Docker image

   ```shell
   docker pull docker.elastic.co/elasticsearch/elasticsearch:8.17.2
   ```

### 5. **Run Elasticsearch Container**
   Make sure you have Docker Desktop running in the background. Then, open up terminal and run the following command which starts Elasticsearch locally.
   
   ```shell
   docker run --name elasticsearch `
   --net elastic `
   -e "discovery.type=single-node" `
   -e "xpack.security.enabled=false" `
   -e "network.host=0.0.0.0" `
   -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" `
   -p 9200:9200 `
   -it docker.elastic.co/elasticsearch/elasticsearch:8.17.2
   ```
    
  >[!Note]
  > If you are running this command for the first time, Docker will pull the official Elasticsearch image before starting the container.
  > Once done, in the future, we can just start start the container from Docker Desktop.

  >[!WARNING]
  > For production and real life deployment, this command is discouraged as it disable security features according to [documentation](https://python.langchain.com/docs/integrations/vectorstores/elasticsearch/).
  > But for now, we will just disable it.

### 6. **Download LLM**
   Make sure Ollama is running in the background, then open up terminal and run the following command which downloads Meta's llama 3.2 3B model to your local machine
    
   ```shell
    ollama pull llama3.2
   ```

### 7(a). **Scrape ESG-Related Articles from NewsAPI**
  To scrape the latest ESG-related articles without performing fact-checking, run:
  
  ```shell
  python <REPO-ROOT>/webscraping/main.py --scrape 
  ```

  >[!NOTE]
  >  Use this option when you want to update the dataset with new ESG-related articles but do not need to run fact-checking immediately.

### 7(b). **Fact-Check ESG Claims from Corporate Reports**
  To fact-check ESG-related claims from corporate reports without scraping new articles, run:

  ```shell
  python <REPO-ROOT>/webscraping/main.py --query 
  ```
  >[!NOTE]
  > This option is useful when you want to verify ESG claims using previously scraped articles, saving time by skipping the scraping step.

### 7(c). **Fact-Check Using a Custom Query**
  To fact-check a user-defined query (instead of claims from corporate reports), run:

  ```shell
  python <REPO-ROOT>/webscraping/main.py --query "Your Query Here" 
  ```
  >[!NOTE]
  > This allows you to manually check specific ESG-related statements using the existing dataset.

### 7(d). **Scrape ESG Articles and Perform Fact-Checking**
  To scrape the latest ESG-related articles and immediately perform fact-checking, run:

  ```shell
  python <REPO-ROOT>/webscraping/main.py --scrape --query 
  ```

  >[!NOTE]
  > This ensures that fact-checking is conducted using the most up-to-date ESG-related news articles.
