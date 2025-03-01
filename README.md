# 🤖 automating-esg-data-extraction-and-performance-analysis

## Repository Description

This repository contains the code, documentation, and resources for Group 6 of the NUS course DSA3101: Data Science in Practice for the AY24/25 Semester 2.

## Project Description

This project aims to design an automated ESG data extraction and performance evaluation system through the use of Natural Language Processing techniques.


## Project Overview

## 🚀 Getting Started

## 🌀 Run Data Pipeline and RAG

This section here is intened for a single Docker container setup for the data pipeline and RAG. 
In due course, it will be integrated into the the multi Docker container setup.

### Pre-Requisites

- [**Python 3.10.x**](https://www.python.org/downloads/)
  - Python >= 3.11.x may not work well with Spark NLP since the library is poorly maintained.
- [**Java 11**](https://www.oracle.com/sg/java/technologies/downloads/#java11)
  - Needed for Apache Spark, PySpark and Spark NLP
  - Although Apache Spark supports Java 8, 11, 17, Spark NLP only supports Java 8 and 11.
  - For Java 8, older versions of it might not be supported.
  - Thus, Java 11 is the choice for this project.
- [**Apache Spark**](https://spark.apache.org/downloads.html)
  - We have only tested up to version 3.5.4
  - For future versions, may need to manually check if it is compatible with both PySpark and SparkNLP
  - Needed for PySpark and Spark NLP
- [**Docker Desktop**](https://www.docker.com/products/docker-desktop/)
  - Needed to run containers
  - Certain services like Elasticsearch can only run with Docker if you want to use it locally.
- [**Ollama**](https://ollama.com/)
  - An API to run LLMs like llamma 3.2 which we are using for this project.

>[!NOTE]
>
>- The installation of Docker Desktop should be straightforward just by clicking the link and following the official Download instructions.
>- For installation of Java 11 and Apache Spark, can refer to this [Article](https://medium.com/@deepaksrawat1906/a-step-by-step-guide-to-installing-pyspark-on-windows-3589f0139a30) and follow through.
>- Note that in the article, they mentioned about downloading `winutils.exe` from a [GitHub repo](https://github.com/steveloughran/winutils).
> However, there are many versions.
> To pick the correct one, take note of "Choose a package type:" when downloading Apache Spark. For example, in the image below, it shows 3.3.
> Thus, we should download `winutils.exe` from the `hadoop-3.0.0/bin` [folder](https://github.com/steveloughran/winutils/tree/master/hadoop-3.0.0/bin).
> ![Apache_Hadoop_Version](./attachments/Apache_Hadoop_Version.png)

>[!IMPORTANT]
>
> - It is important to set the various system environment variables (`JAVA_HOME`, `SPARK_HOME`, `HADOOP_HOME`) and add their binary folders (`/bin/`) to system PATH, as stated in the article.
> - To prevent `Py4JJavaError` when using Spark, we need to set a few extra system environment variables.
> - Go to "Edit the system environment variables" on Windows and create new environment variables (`PYTHON_DRIVER_PYTHON`, `PYSPARK_PYTHON`, `SPARK_LOCAL_HOME`)
> and set their values as (`python`, `python`, `127.0.0.1`) respectively and save it. See images below for more details.
> ![Extra_Env_Var_1](./attachments/Extra_Env_Var_1.png)
> ![Extra_Env_Var_2](./attachments/Extra_Env_Var_2.png)
> ![Extra_Env_Var_3](./attachments/Extra_Env_Var_3.png)

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

2. **Setup Repo Environment Variables**

  Open up the repo in IDE (VSCode) and create a `.env` file at the repo's root. And set the following environment variables.
  An example is shown below.

- `SERVICE_ACCOUNT_FILE`: For automatic downloading of PDFs from Google Drive.
- `SERVICE_ACCOUNT_SCOPES`: For automatic downloading of PDFs from Google Drive.
- `DEST_FOLDER`: Path to store the PDFs automatically downloaded from Google Drive; need to end with `/`.
- `ESG_REPORTS_FOLDER`: Path where the downloaded ESG report PDFs are stored
- `ESG_REPORTS_JSON_FOLDER`: Path where the parsed data in JSON format from ESG Reports are stored.
- `ESG_REPORTS_CSV_FOLDER`: Path to store the CSVs produced from processing the JSON files using Spark NLP.
- `ES_INDEX_NAME`: Name of the index of Elasticsearch where we index our text chunks.
- `RAG_OUTPUT_FOLDER`: Output folder to store the LLM's response for each company for each ESG metric.

  ```text
  ESG_REPORTS_FOLDER = "C:/Zhenjie/University/Y3S2/dsa3101-ay2425s2-team6/data-pipelines/data/esg-pdf/"
  ESG_REPORTS_JSON_FOLDER = "C:/Zhenjie/University/Y3S2/dsa3101-ay2425s2-team6/data-pipelines/data/esg-json/"
  ESG_REPORTS_CSV_FOLDER = "C:/Zhenjie/University/Y3S2/dsa3101-ay2425s2-team6/data-pipelines/data/esg-csv/"
  ES_INDEX_NAME = "esg_reports_demo"
  RAG_OUTPUT_FOLDER = "C:/Zhenjie/University/Y3S2/dsa3101-ay2425s2-team6/data-pipelines/data/rag-output/"
  ```

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

7. **Convert PDFs to JSON**

  We can either run the Python script `<REPO-ROOT>/data-pipelines/esg-pdf-to-json/esg_pdf_to_json.py` directly inside VSCode.
  Or we can run it from the terminal.

  ```shell
  python <REPO-ROOT>/data-pipelines/esg-pdf-to-json/esg_pdf_to_json.py
  ```

  >[!NOTE]
  > The rationale for doing this step is because reading and parsing PDF is an expensive process.
  > So we only want to to it once and store it.
  > JSON is the choice of storage as it is highly scalable and flexible form of storage.

8. **Process JSON to CSVs**

  We can either run the Python script `<REPO-ROOT>/data-pipelines/esg-json-to-csv/esg_json_to_csv.py` directly inside VSCode.
  Or we can run it from the terminal.

  ```shell
  python <REPO-ROOT>/data-pipelines/esg-json-to-csv/esg_json_to_csv.py
  ```

  >[!NOTE]
  > This step uses Spark NLP to extract keywords from the text chunks in the JSON.
  > This is necessary to improve the perfomance of retrieval from Elasticsearch (ES) later on.
  > CSV is the choice of storage because later on we have to insert (index) data into ES
  > and CSVs are easy to iterate over.

9. **Indexing into Elasticsearch**

  We can either run the Python script `<REPO-ROOT>/data-pipelines/elasticsearch/elasticsearch_indexing.py` directly inside VSCode.
  Or we can run it from the terminal.

  ```shell
  python <REPO-ROOT>/data-pipelines/elasticsearch/elasticsearch_indexing.py
  ```

  >[!NOTE]
  > Elasticsearch is the choice of data store for our text chunks and keywords as we can do complex filtering logic that other DBs could not offer.
  > Furthermore, its performance is better than traditional vector DBs like ChromaDB since it offers Hybrid Search.

  >[!WARNING]
  > Before running this step, make sure your Docker Desktop is running in the background
  > and you have the Elasticsearch container running.

10. **RAG Phase**

  We can either run the Python script `<REPO-ROOT>/data-pipelines/rag-engine.py` directly inside VSCode.
  Or we can run it from the terminal.

  ```shell
  python <REPO-ROOT>/data-pipelines/rag-engine.py
  ```

  >[!NOTE]
  > This set can be summarized as given an ESG metric, we want to retrieve an appropiate context (text chunk) from Elasticsearch
  > then feed this retrieved context together with the ESG metric as a prompt into the LLM for it to evaluate the company
  > based on the ESG metric. And we do this for all companies, for all ESG metrics.

  > Before running this step, make sure your Docker Desktop is running in the background with Elasticsearch container running.
  > Also, make sure Ollama is running in the background too.

## 🧊 Contributing

All contributions are to be merged to main via pull request.

### Branches

- branches recommended to follow the following format: `<username>-<feature>-<subfeature>`
  - `<name>`: GitHub username or any name that is easy to identify the owner of the branch. Strictly no spaces and all letters in lowercase.
  - `<feature>`: The name of the feature that the code is meant for.
  - `<subfeature>`: Optional input. Depends on whether the main feature is being broken down into subfeatures due to its complexity.
- For example: `nghockleong-loginpage-userauthentication`

### Commit Messages

Be clear and concise with the intent of the commit.

### Coding guidelines

Follows general software engineering practices. Some examples of good practices are as follows:

- Clear documentation for code written
- Meaningful function and variable names
- Refactor overly complex code into smaller chunks of code
- Code should avoid being interdependent (Changing 1 code chunk does not require huge changes across other code chunks and modules)
- Adhere to official style guides for all languages to the best of your ability.
  - Python style guide: [PEP 8 - Python Style Guide](http://www.python.org/dev/peps/pep-0008)
- Do not push your secrets such as API keys to GitHub; store them in a `.env` file instead.
- Do not push model checkpoint or weights files (`.pth` or `.pt`) to GitHub as you most likely won't succeed due to the large file size.
- Do not push datasets to GitHub as it may cuz the changes count to explode on GitHub.

## 🌐 Repository Structure

## 📋 Documentations
