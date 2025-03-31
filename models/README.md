# Models

We mainly have 2 models in our project:

1) ESG data extraction model
2) LSTM model for stock price forecasting

## ESG data extraction model

Files associated to model can be found in `model_code/`

How to use:

1) Create .env file in `model_code/` with the following sample environment variables
ES_HOST='http://localhost:9200/'
ES_INDEX_NAME='esg_reports'
