# Data Pipelines

## Overview of `data-pipelines` folder

This folder contains scripts to run data pipelines.
To avoid error, create the following folders as shown below:

```text
data-pipelines/
├── data/
│   ├── esg-data-against-external-eval/
│   ├── esg-json/
│   ├── esg-metric/
│   ├── esg-pdf/
│   ├── esg-spark-process-csv/
│   └── external-esg-data-csv/
```

The `data/` folder contains **MOST** of the raw data + data outputs for the entire project.

### What is missing?

1) ESG model evaluation by test case results
2) Stocks prediction data should be in the `docker/` folder as it needs to be copied and fed into PSQL container subsequently via

    ```shell
    docker cp ./companies_stock_price_data.csv postgres:/var/lib/postgresql/data
    ```

3) sample ESG data to be fed into our dashboards in `frontend/esg_data.json`


### Overview of Our Pipelines

We have 4 pipelines in total:

1) `pdf_to_elasticsearch.py`: Converts raw PDF files **named in our convention** stored in our google drive into text chunks and uploaded onto Elasticsearch. Code has involves the following directories:

    - PDF file downloaded locally in input folder `esg-pdf/` with the format: `<report_year>_<company_name>_ESG_Report.pdf`
    - JSON file containing PDF data at a page level found in output folder `esg-json/`
    - CSV file containing smaller text chunks found in output folder `esg-spark-process-csv/` produced by sparkNLP
    - `esg_gdrive_to_local/`, `esg_pdf_to_json/`, `esg_json_to_csv/`, `esg_csv_to_elasticsearch/` contain helpers for `pdf_to_elasticsearch.py`.

2) `generate_esg_metrics_json.py`:
Based on PDF reports stored in Elasticsearch, generate stated metrics for given companies and outputs in `esg-metric/` as `rag_output.json`
Generation of this requires the model API endpoint to be active. Refer to `README.md` in `models/` to find out more.

3) `newsapi_to_elasticsearch.py`:
Using NewsAPI, scrape ESG data for selected companies within a given time period and produces a .csv file for each company in the following format: `scraped_data_<company_name>_<start_date>_to_<end_date>.csv` which will be stored in `external-esg-data-csv/`. After creating these `.csv` files, uploads them onto Elasticsearch

    - `newsapi_web_to_csv/`,`newsapi_csv_to_elasticsearch/` contain helpers for `newsapi_to_elasticsearch.py`.

4) `fact_check_esg_report_json_against_ext.py`:
Given `rag_output.json` within `esg-metric/` folder, for each output, run a cross validation with external data that is already stored in Elasticsearch. After processing, produces output in `esg-data-against-external-eval/` folder.

    - `fact_check_esg_report_against_ext/` contains helpers for `fact_check_esg_report_json_against_ext.py`

> [!NOTE]
> Pipeline for `pdf_to_elasticsearch.py`: Google Drive (Simulating Amazon S3) -> PDF locally -> JSON -> CSV -> Elasticsearch

## Pre-Requisites

1) [**Python 3.10.x**](https://www.python.org/downloads/)
    - Python >= 3.11.x may not work well with Spark NLP since the library is poorly maintained.

2) [**Java 11**](https://www.oracle.com/sg/java/technologies/downloads/#java11)
    - Needed for Apache Spark, PySpark and Spark NLP
    - Although Apache Spark supports Java 8, 11, 17, Spark NLP only supports Java 8 and 11.
    - For Java 8, older versions of it might not be supported.
    - Thus, Java 11 is the choice for this project.

3) [**Apache Spark**](https://spark.apache.org/downloads.html)
    - We have only tested up to version 3.5.4
    - For future versions, may need to manually check if it is compatible with both PySpark and SparkNLP
    - Needed for PySpark and Spark NLP

> [!NOTE]
>
> - The installation of Docker Desktop should be straightforward just by clicking the link and following the official Download instructions.
> - For installation of Java 11 and Apache Spark, can refer to this [Article](https://medium.com/@deepaksrawat1906/a-step-by-step-guide-to-installing-pyspark-on-windows-3589f0139a30) and follow through.
> - Note that in the article, they mentioned about downloading `winutils.exe` from a [GitHub repo](https://github.com/steveloughran/winutils).
>   However, there are many versions.
>   To pick the correct one, take note of "Choose a package type:" when downloading Apache Spark. For example, in the image below, it shows 3.3.
>   Thus, we should download `winutils.exe` from the `hadoop-3.0.0/bin` [folder](https://github.com/steveloughran/winutils/tree/master/hadoop-3.0.0/bin).
>   ![Apache_Hadoop_Version](./attachments/Apache_Hadoop_Version.png)

> [!IMPORTANT]
>
> - It is important to set the various system environment variables (`JAVA_HOME`, `SPARK_HOME`, `HADOOP_HOME`) and add their binary folders (`/bin/`) to system PATH, as stated in the article.
> - To prevent `Py4JJavaError` when using Spark, we need to set a few extra system environment variables.
> - Go to "Edit the system environment variables" on Windows and create new environment variables (`PYTHON_DRIVER_PYTHON`, `PYSPARK_PYTHON`, `SPARK_LOCAL_IP`) and set their values as (`python`, `python`, `127.0.0.1`) respectively and save it.
> The images below shows how to do it on Windows OS but the concept is same for MacOS and Linux.
> ![Extra_Env_Var_1](./attachments/Extra_Env_Var_1.png)
> ![Extra_Env_Var_2](./attachments/Extra_Env_Var_2.png)
> ![Extra_Env_Var_3](./attachments/Extra_Env_Var_3.png)

4) [**Ollama**](https://ollama.com/download) desktop installed and running in background with Llama 3.2 pulled

    ```shell
    ollama pull llama3.2
    ```

5) [**Docker**](https://www.docker.com/products/docker-desktop/) desktop installed and running in background to run Elasticsearch container

6) Python library dependencies within `requirements.txt` (located in this directory) installed

    ```shell
    pip install -r requirements.txt
    ```

7) A `.env` file created in this directory

Sample file is as follows:

    ```text
    ESG_REPORTS_PDF_FOLDER=data/esg-pdf/
    ESG_REPORTS_JSON_FOLDER=data/esg-json/
    ESG_REPORTS_CSV_FOLDER=data/esg-spark-processed-csv/
    REPORT_ES_INDEX_NAME='esg_reports'
    ES_HOST='http://localhost:9200/'
    RAG_OUTPUT_DIR=data/esg-metric/
    ESG_MODEL_METRIC_EXTRACTION_URL='http://localhost:8000/esg-data-extraction-model/extract-esg-metrics'

    NEWSAPI_API_KEY=<api_key>
    EXTERNAL_SCRAPE_INDEX_NAME='external_esg_data'
    EXTERNAL_ESG_DATA_CSV_FOLDER=data/external-esg-data-csv/
    RAG_OUTPUT_FILENAME=rag_output.json
    ESG_REPORT_VAL_AGAINST_EXT_DATA_FOLDER=data/esg-data-against-external-eval/
    ESG_REPORT_VAL_AGAINST_EXT_DATA_FILENAME=esg-data-against-external-eval.csv
    ```
You make make adjustments according to your needs but this is as per our implementation.

## Running Pipeline Scripts

### `pdf_to_elasticsearch.py`

1) First download the ESG PDF reports from [Google Drive](https://drive.google.com/drive/folders/1NXaHl4MyrZNW14tCktLxSYUmrs52NATD?usp=sharing) and place them at `data-pipelines/data/esg-pdf`.
2) If the `.env` is ready, go over to `docker/` and run the following command to start the Elasticsearch container (and other containers).

    ```shell
    docker compose up -d
    ```

3) Assuming that you have the following ready:
    - ESG PDF reports downloaded from Google Drive and placed at `data-pipelines/data/esg-pdf`
    - `.env` file correct
    - Spark ready and well configured with the correct versioning on spark and its dependencies
    - Elasticsearch container up and running
    - You already installed all the libraries at the very start via `requirements.txt` which contains all library dependencies within `data-pipelines/`
    - You may now run:

    ```shell
    python pdf_to_elasticsearch.py
    ```

> [!NOTE]
> Feel free to comment out parts of the pipeline if you already have them locally. This will upload the ESG reports onto our Elasticsearch instance.

### `generate_esg_metrics_json.py`

1) Assuming that you have the data ready on Elasticsearch, correct `.env` file, model API endpoint active and necessary library dependencies ready, run the following command to generate the metrics in .json format in `data/esg-metric/` as `rag_output.json`

  ```shell
  python generate_esg_metrics_json.py
  ```

### `newsapi_to_elasticsearch.py`

1) Assuming that you have Elasticsearch container running, correct `.env` file and necessary library dependencies ready, run the following command to upload NewsAPI data onto Elasticsearch

  ```shell
  python newsapi_to_elasticsearch.py
  ```

### `fact_check_esg_report_json_against_ext.py`

1) Assuming that you have Elasticsearch container running, correct `.env` file and necessary library dependencies ready, run the following command to cross validate output provided by the ESG model in `RAG_OUTPUT_FILENAME` and outputs it in `esg-data-against-external-eval/`

  ```shell
  python fact_check_esg_report_json_against_ext.py
  ```
