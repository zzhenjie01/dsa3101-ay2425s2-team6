# Models

We mainly have 2 models in our project:

1) ESG data extraction model
2) LSTM model for stock price forecasting

## Prequisites
1) Ollama desktop with llama:3.2 pulled
```
ollama pull llama3.2
```
2) Docker desktop to run ElasticSearch container
3) Python library dependencies within `requirements.txt` found in this directory
```
pip install -r requirements.txt
```
Note: `requirements.txt` contains library dependencies for both models.

## Instructions to use ESG data extraction model
There are 2 parts to this:
1) Model
2) Model test cases
### ESG data extraction model

Files associated to ESG data extraction model can be found in `model_code/`
How to use:

1) Head over to `docker/` in the root directory and run the following command:
```
docker compose up -d
```
This command activates all containers required to run the app

2) Create .env file in `model_code/` with the following sample environment variables
```
ES_HOST='http://localhost:9200/'
ES_INDEX_NAME='esg_reports'
```
ES_HOST is the URL in which ElasticSearch containing ESG report chunks is hosted.
ESG_INDEX_NAME is the index in which ESG report chunks are stored in.

Uploading can be done using `pdf_to_elasticsearch.py` if not already done so.
Refer to README.md in `data-pipelines/` to find out more.

3) Head over to `model-code/` and run the following command to start the ESG extraction model API endpoint:
```
uvicorn esg_extraction_model_endpoint:app
```
Model runs on localhost with PORT 8000 [API Documentation](http://localhost:8000/docs)

Model supports the following POST requests:
`/esg-data-extraction-model/chatbot`: API call to the chatbot
API endpoint was mainly built for internal use and hence, no sample request

`/esg-data-extraction-model/extract-esg-metrics`: API call to extract ESG metrics
Sample request:
```
curl -X 'POST' \
  'http://localhost:8000/esg-data-extraction-model/extract-esg-metrics' \
  -H 'Content-Type: application/json' \
  -d '{
    "company_name": "citigroup",
    "esg_metric": "GHG emission",
    "report_year": "2022"
  }'
```
Note: 
1) company_name must be fully lowercase due to implementation of ElasticSearch
2) all fields are strings.

`/esg-data-extraction-model/question-and-answer`: API call to post a question to the model
Sample request:
```
curl -X 'POST' \
  'http://localhost:8000/esg-data-extraction-model/question-and-answer' \
  -H 'Content-Type: application/json' \
  -d '{
    "question": "What is the environmental performance of the company in 2024?"
  }'

```

### ESG data extraction model testcases
Code to run tests found in `model-tests/` folder.
Sample test cases found in `model-tests/evaluation_data/`
Results output into `model-tests/evaluation_results/`

Steps to use:
1) Create .env file in `model-tests/`
Sample environment variable
```
ESG_MODEL_METRIC_EXTRACTION_URL='http://localhost:8000/esg-data-extraction-model/question-and-answer'
TC_FOLDER_DIR=evaluation_data/
TC_EVAL_RESULT_DIR=evaluation_results/
```
2) Stay in `model-tests/` and set ollama model for deepeval
```
deepeval set-ollama deepseek-r1:1.8b
```
Ensure Ollama is installed and use any reasoning model that you prefer (in this case deepseek-r1:1.8b)

3) Run `evaluate_testcases.py`
```
python evaluate_testcases.py
```
Due to slow evaluation, each test case takes about 1min.
We have a total of 48 evaluations hence, expected run time is about an hour.

## Instructions to use LSTM stocks prediction model

Code can be found in `stock-price-forecast-model/`

Assuming dependencies installed as per instructions at the very top,
head over to `stock-price-forecast-model/` directory and run the following command:
```
python stocks_prediction_lstm.py
```

You are required to
1) Adjust the company name to match dashboard requirements accordingly
2) Adjust .csv file to match filename for the corresponding company

3) within `stocks_prediction_lstm.py`