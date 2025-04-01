# Models

We mainly have 2 models in our project:

1) **ESG Data Extraction Model**
2) **LSTM Model for stock price forecasting**

## Pre-Requisites

- [Ollama](https://ollama.com/download) desktop installed, running in background and with Llama 3.2 pulled

    ```shell
    ollama pull llama3.2
    ```

- [Docker](https://www.docker.com/products/docker-desktop/) desktop installed and running in background to run Elasticsearch container

- Python library dependencies within `requirements.txt` found in this directory

    ```shell
    pip install -r requirements.txt
    ```

> [!NOTE]
> `requirements.txt` contains library dependencies for both models.

## Instructions to use ESG Data Extraction Model

There are 2 parts to this:

1) Model
2) Model test cases

### Part 1: ESG Data Extraction Model

Files associated to ESG data extraction model can be found in `esg-data-extraction-model/model_code/`

#### How to use:

1) Head over to `docker/` in the repo root directory and run the following command which activates all containers required to run the app

    ```shell
    docker compose up -d
    ```

2) Create `.env` file in `esg-data-extraction-model/model_code/` with the following environment variables

    ```text
    ES_HOST='http://localhost:9200/'
    ES_INDEX_NAME='esg_reports'
    ```

> [!NOTE]
>
> - `ES_HOST` is the URL in which ElasticSearch containing ESG report chunks is hosted.
> - `ESG_INDEX_NAME` is the index in which ESG report chunks are stored in.

> [!NOTE]
>
> - Uploading of ESG PDF reports to Elasticsearch can be done using `pdf_to_elasticsearch.py` if not already done so.
> - Refer to `README.md` in `data-pipelines/` to find out more.

3) Head over to `esg-data-extraction-model/model_code/` and run the following command to start the ESG extraction model API endpoint:

    ```shell
    uvicorn esg_extraction_model_endpoint:app
    ```

#### Extra Information:

Model runs on localhost with PORT 8000 [API Documentation](http://localhost:8000/docs). Model supports the following POST requests:

- **`/esg-data-extraction-model/chatbot`:** API call to the chatbot
API endpoint was mainly built for internal use and hence, no sample request
- **`/esg-data-extraction-model/extract-esg-metrics`:** API call to extract ESG metrics. Sample request:

    ```shell
    curl -X 'POST' \
      'http://localhost:8000/esg-data-extraction-model/extract-esg-metrics' \
      -H 'Content-Type: application/json' \
      -d '{
        "company_name": "citigroup",
        "esg_metric": "GHG emission",
        "report_year": "2022"
      }'
    ```

> [!NOTE]
>
> 1. Company_name must be fully lowercase due to implementation of ElasticSearch
> 2. All fields are strings.

- **`/esg-data-extraction-model/question-and-answer`:** API call to post a question to the model. Sample request:

    ```shell
    curl -X 'POST' \
      'http://localhost:8000/esg-data-extraction-model/question-and-answer' \
      -H 'Content-Type: application/json' \
      -d '{
        "question": "What is the environmental performance of the company in 2024?"
      }'
    ```

### Part 2: ESG data extraction model testcases

Code to run tests found in `esg-data-extraction-model/model-tests/` folder. Sample test cases found in `esg-data-extraction-model/model-tests/evaluation_data/`. Results output into `esg-data-extraction-model/model-tests/evaluation_results/`

#### Steps to use:

1) Create `.env` file in `esg-data-extraction-model/model-tests/`. Sample file:

    ```text
    ESG_MODEL_METRIC_EXTRACTION_URL='http://localhost:8000/esg-data-extraction-model/question-and-answer'
    TC_FOLDER_DIR=evaluation_data/
    TC_EVAL_RESULT_DIR=evaluation_results/
    ```

> [!NOTE]
>
> - `ESG_MODEL_METRIC_EXTRACTION_URL`: QnA API endpoint
> - `TC_FOLDER_DIR`: to store testcases in `.json` format
> - `TC_EVAL_RESULT_DIR`: to store validation result in `.csv` format after evaluation

2) Stay in `esg-data-extraction-model/model-tests/` and set Ollama model for deepeval

    ```shell
    deepeval set-ollama deepseek-r1:8b
    ```

> [!NOTE]
> Ensure Ollama is installed and use any reasoning model that you prefer (in our  case `deepseek-r1:8b`)

3) Run `evaluate_testcases.py`

    ```shell
    python evaluate_testcases.py
    ```

> [!WARNING]
>
> - Due to slow evaluation, each test case takes about 1min.
> - We have a total of 48 evaluations hence, expected run time is about an hour.

## Instructions to use LSTM Stocks Prediction Model

Code can be found in `stock-price-forecast-model/`

Assuming dependencies installed as per instructions at the very top, create a `.env` folder at `stock-price-forecast-model/` that contains the path to folder containing various companies stock data. A sample is shown below:

```text
BANK_STOCKS_DATA_FOLDER_DIR='bank_stocks_data/'
```

Then, head over to `stock-price-forecast-model/` directory and run the following command:

```shell
python stocks_prediction_lstm.py
```

> [!NOTE]
>
> You are required to
>
> 1) Adjust the company name to match dashboard requirements accordingly.
> 2) Adjust .csv file to match filename for the corresponding company within `stocks_prediction_lstm.py`

> [!IMPORTANT]
> You can skip the running of this LSTM model since we already provided the forecasted stock price predictions in `docker/`
