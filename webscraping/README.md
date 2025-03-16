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
  - An API to run LLMs like llamma 3.1 which we are using for this project.
- [NewsAPI](https://newsapi.org/)
  - An API to gather news articles related to ESG topics for analysis and fact-checking which we are using for this project.
  - Sign up for NewsAPI and obtain an API key to access news articles. You will need to add your API key to the `.env` file.
  

>[!NOTE]
>
>- The installation of Docker Desktop should be straightforward just by clicking the link and following the official Download instructions.

### Workflow

1. **Clone the Repository**

   Open terminal or Command Prompt and `cd` into your desired local directory.
  
    ```shell
    cd <desired-local-directory>
    ```
    
   Run the following `git clone` command to clone the GitHub repo to your local machine
  
    ```shell
    git clone https://github.com/zzhenjie01/dsa3101-ay2425s2-team6.git
    ```
    
2. **Set Up Repo Environment Variables**
   
   Open up the repo in IDE (VSCode) and create a `.env` file at the repo's root.
   Then, set the following environment variables.
   
    - `ES_INDEX_NAME`: The name of your Elasticsearch index
    - `ES_HOST`: The host URL for your Elasticsearch instance
    - `NEWSAPI_KEY`: Your API key for NewsAPI
    - `SAVE_DIR`: Directory where scraped data will be saved
  
    ```text
    ES_INDEX_NAME = esg_articles
    ES_HOST = http://localhost:9200
    NEWSAPI_KEY = '37439fc0e11546dd9b81a6f698800573'
    SAVE_DIR = ./data 
    ```
  >[!IMPORTANT]
  > Notice the paths above ends with `/`. This is important as the scripts may not work correctly if you leave it out.


3. **Install required dependencies**
   
   Install the required dependencies by running the following in your terminal:
   
   Open up terminal and run the following:
  
    ```shell
    cd <REPO-ROOT>/web-scraping
    ```
  
    ```shell
    pip install -r requirements.txt
    ``` 

4. **Docker Setup for Local Development**
   Elasticsearch will be run in a Docker container to handle indexing and searching of ESG-related articles. To set it up:

   Creating a Docker network for communication between containers
  
    
    docker network create elastic
    
  
    Pull the Elasticsearch Docker image
  
    
    docker pull docker.elastic.co/elasticsearch/elasticsearch:8.17.2


   Run the Elasticsearch container with the appropriate settings
  
    
    docker run --name elasticsearch `
    --net elastic `
    -e "discovery.type=single-node" `
    -e "xpack.security.enabled=false" `
    -e "network.host=0.0.0.0" `
    -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" `
    -p 9200:9200 `
    -it docker.elastic.co/elasticsearch/elasticsearch:8.17.2
    

### Workflow

3. **Download PDFs**

    Can either download manually from [Google Drive](https://drive.google.com/drive/folders/1NXaHl4MyrZNW14tCktLxSYUmrs52NATD)
    and place them at `<REPO-ROOT>/data-pipelines/data/esg-pdf`. Or could run the following command in the terminal.
    Note the `<REPO-ROOT>` is just a placeholder; need to replace it with your actual path to the repo's root.
  
    ```shell
    cd <REPO-ROOT>/data-pipelines/esg-gdrive-to-local
    ```
  
    ```shell
    python esg_gdrive_to_local.py
    ```

4. **Install Python Packages**

    Open up terminal and run the following:
  
    ```shell
    cd <REPO-ROOT>/data-pipelines
    ```
  
    ```shell
    pip install -r requirements.txt
    ```

5. **Download LLM**
  
    Make sure Ollama is running in the background and open up terminal and run the following command
    which downloads Meta's Llama 3.2 3B model to your local machine.
  
    ```shell
    ollama pull llama3.2
    ```

6. **Run Elasticsearch Container**

    Make sure you have Docker Desktop running in the background. Then, open up terminal and run the following command which starts Elasticsearch locally.
  
    ```shell
    docker run -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e "xpack.security.http.ssl.enabled=false" docker.elastic.co/elasticsearch/elasticsearch:8.12.1
    ```

  >[!Note]
  > If you are running this command for the first time, Docker will pull the official Elasticsearch image before starting the container.
  > Once done, in the future, we can just start start the container from Docker Desktop.

  >[!WARNING]
  > For production and real life deployment, this command is discouraged as it disable security features according to [documentation](https://python.langchain.com/docs/integrations/vectorstores/elasticsearch/).
  > But for now, we will just disable it.

   
    
