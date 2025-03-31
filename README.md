# 🤖 automating-esg-data-extraction-and-performance-analysis

## Repository Description

This repository contains the code, documentation, and resources for Group 6 of the NUS course DSA3101: Data Science in Practice for the AY24/25 Semester 2.

## Project Description

This project aims to design an automated ESG data extraction and performance evaluation system through the use of Natural Language Processing techniques.

## Key features
1) Web app to display ESG data (`frontend/`, `backend/`)
- Dashboard to show ESG data by company
- Leaderboard to compare companies
- Built in recommendation to tailor views to users
2) ESG data extraction model (`models/`, `data-pipelines/`)
- Web scrape ESG data (`data-pipelines/`)
- Model Evaluator (fo ESG data extraction model) (`models/`)
3) LSTM stocks price forecasting model (`models/`)

## Brief instructions to use the web app fully
This assumes that you have all necessary
- Softwares (Spark, Ollama, Docker Desktop, Node etc.)
- Programming languages (Java, Python etc.)
- .env files created in the necessary locations (`data-pipelines/`, `docker/`, `'backend/`, `models/esg-data-extraction-model/model-code/`, `models/esg-data-extraction-model/model-test/`, `models/stock-price-forecast-model/`)
- libraries (Python etc.)

1) Head over to `docker/` and run the following command to start all the necessary docker containers using the following command:
```
docker compose up -d
```
2) Copy stocks data into PSQL using the following command in `docker/`
```
docker cp ./companies_stock_price_data.csv postgres:/var/lib/postgresql/data
```
3) go to `backend/` to run
```
npm install
```
followed by
```
node src/server.js
```
If it does not run, remember to create root user for mongoDB. (Refer to README.md in `backend/` for more information)
4) go to `data-pipelines/` and run
```
python pdf_to_elasticsearch.py
```
so that the chatbot has ESG data to retrieve
5) go to `models/esg-data-extraction-model/model-code/` and run
```
uvicorn esg_extraction_model_endpoint:app
```
so that the chatbot has an endpoint to call to.

To use other features in this app, head over to their respective folders and read their README.md
6) start the frontend using the follow commands in `frontend/`:
```
npm install
```
and
```
npm run dev
```
to start in development mode

## Ports used (do not clash port as they are mainly TCP in nature)
5678: postgreSQL
9200: ElasticSearch
27017: MongoDB
9090: Spark Image UI
7077: Spark master in spark iamge
5173: Web app (client side)
5000: Web app (server side)
8000: ESG extraction model

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

```

```
