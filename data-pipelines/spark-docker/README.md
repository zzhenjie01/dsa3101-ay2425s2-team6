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
