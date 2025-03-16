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
  
    
    docker -- version
    
- [Ollama](https://ollama.com/)
  - An API to run LLMs like llamma 3.1 which we are using for this project.
- [NewsAPI](https://newsapi.org/)
  - An API to gather news articles related to ESG topics for analysis and fact-checking which we are using for this project.
  

>[!NOTE]
>
>- The installation of Docker Desktop should be straightforward just by clicking the link and following the official Download instructions.

### Workflow

1. Clone the Repository

    Open terminal or Command Prompt and cd into your desired local directory.
  
    
    cd <desired-local-directory>
    
  
    Run the following git clone command to clone the GitHub repo to your local machine
  
    
    git clone https://github.com/zzhenjie01/dsa3101-ay2425s2-team6.git

2. Docker Setup for Local Development
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
    
3. 

   
    
