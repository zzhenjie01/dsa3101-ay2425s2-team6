#!/bin/bash

SPARK_WORKLOAD=$1
SPARK_WORKER_CORES=$2
SPARK_WORKER_MEMORY=$3

echo "SPARK_WORKLOAD: $SPARK_WORKLOAD"
echo "SPARK_WORKER_CORES: $SPARK_WORKER_CORES"
echo "SPARK_WORKER_MEMORY: $SPARK_WORKER_MEMORY"

if [ "$SPARK_WORKLOAD" == "master" ];
then
  start-master.sh -p 7077
elif [ "$SPARK_WORKLOAD" == "worker" ];
then
  start-worker.sh spark://spark-master:7077
  --cores $SPARK_WORKER_CORES \
  --memory $SPARK_WORKER_MEMORY
elif [ "$SPARK_WORKLOAD" == "history" ]
then
  start-history-server.sh
fi