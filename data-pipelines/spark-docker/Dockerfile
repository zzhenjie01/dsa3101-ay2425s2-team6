FROM python:3.10-bullseye AS spark-base

ARG SPARK_VERSION=3.5.4

# Install java, python
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      sudo \
      curl \
      vim \
      unzip \
      rsync \
      openjdk-11-jdk \
      build-essential \
      software-properties-common \
      ssh \
      python3 \
      python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV SPARK_HOME="/opt/spark"
RUN mkdir -p $SPARK_HOME
WORKDIR $SPARK_HOME

# Installing Spark
RUN curl -L "https://dlcdn.apache.org/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz" -o spark-${SPARK_VERSION}-bin-hadoop3.tgz \
 && tar xvzf spark-${SPARK_VERSION}-bin-hadoop3.tgz --directory /opt/spark --strip-components 1 \
 && rm -rf spark-${SPARK_VERSION}-bin-hadoop3.tgz

FROM spark-base AS pyspark

# Installing spark dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# ENV config for spark to work
ENV SPARK_HOME="/opt/spark"
ENV JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64/"
ENV PATH="/usr/lib/jvm/java-11-openjdk-amd64/bin:/opt/spark/sbin:/opt/spark/bin:${PATH}"

ENV SPARK_MASTER="spark://spark-master:7077"
ENV SPARK_MASTER_HOST=spark-master
ENV SPARK_MASTER_PORT=7077
ENV PYSPARK_DRIVER_PYTHON=python
ENV PYSPARK_PYTHON=python

COPY conf/spark-defaults.conf "$SPARK_HOME/conf/"

RUN chmod u+x /opt/spark/sbin/* && \
    chmod u+x /opt/spark/bin/*
  
COPY entrypoint.sh .
#RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]