# Overview of `data-pipelines` folder

This folder contains scripts to run data pipelines.

This folder is supposed to contain a `data/` subfolder
which holds all the data when working locally.

Within `data/` subfolder, we should have the following after running the scripts

1) `esg-pdf/`
2) `esg-json/`
3) `esg-csv/`
4) `rag-output/`

# Using this spark docker image

This spark image uses Python3.10 and Java 11 to support SparkNLP.
Pre-requisite to running docker commands is to have docker in the system.
Install Docker Desktop to simplify the set up process. Leave Docker Desktop running in the background.

To start using this spark image:
1) be in the spark-docker/ directory and run `docker build -t my-spark-image .`. Running this for the first time will take awhile.
2) Once the image has been successfully built, run `docker compose up -d` to start up the spark cluster with a default of 1 worker. Use the --scale tag to increase the number of workers. Example: `docker compose up -d scale spark-worker=3`.
3) Docker compose automatically creates the folders spark-jobs-input/ and spark-jobs-output/. These folders are linked to the Docker environment via bind mounts. Add .py files into spark-jobs-inputs/ before submitting them for processing.
4) To submit a task (let's say theres a `test.py` file in spark-jobs-input/), run `docker exec spark-master spark-submit --master spark://spark-master:7077 input-task/test.py`.
This is because spark-jobs-input/ on the local desktop is bound to the input-task/ folder. If an output is generated, do use the following relative path: output-task/<file_name>.
Example: `pandas_df.to_csv("output-task/sampleOutput.csv", header = False)`

# Convert ESG reports locally from pdf to json

Loading files from .pdf format can be time consuming so
we perform a 1 time processing to convert it to `.json` so that it is easier to load
in the future

To run the scripts, you need the following:

1) `.env` file containing `ESG_REPORTS_FOLDER` (path to the folder containing the esg reports in .pdf)
2) Same .env file containing `ESG_REPORTS_JSON_FOLDER` (path to the folder containing the esg reports in .json)
3) The necessary dependencies: run `pip install -r requirements.txt` where `requirements.txt` is in `data-pipelines/` folder

Once the pre-requisites are met,
run `python esg_pdf_to_json.py`
where command needs to be run within the folder containing `esg_pdf_to_json.py`

# Downloads ESG reports from our google drive to local

This is to ensure that we are aligned on the reports that we are working on
in the absence of cloud services to store our reports.

To run the scripts, you need the following:

1) `.env` file containing `SERVICE_ACCOUNT_FILE` (path to service account key in JSON)
2) Same `.env` file containing `SERVICE_ACCOUNT_SCOPES`(comma separated if more than 1)
3) Within the same `.env` file, the destination folder (`DEST_FOLDER`) to hold your ESG reports locally (must end with `/`)
4) The necessary dependencies: run `pip install -r requirements.txt` where `requirements.txt` is in `data-pipelines/` folder.

Once the pre-requisites are met,
run `python esg_gdrive_to_local.py`
where command needs to be run within the folder containing `esg_gdrive_to_local.py`
