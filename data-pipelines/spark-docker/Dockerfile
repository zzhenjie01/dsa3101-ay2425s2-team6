FROM python:3.12-bullseye

ARG SPARK_VERSION=3.5.4

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
ENV PATH="$SPARK_HOME/sbin:$SPARK_HOME/bin:$PATH"
ENV PYSPARK_PYTHON=python3

RUN mkdir -p $SPARK_HOME
WORKDIR $SPARK_HOME

RUN curl -L "https://dlcdn.apache.org/spark/spark-${SPARK_VERSION}/spark-${SPARK_VERSION}-bin-hadoop3.tgz" -o spark.tgz \
 && tar xzf spark.tgz --strip-components=1 \
 && rm spark.tgz

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY conf/spark-defaults.conf "$SPARK_HOME/conf/"

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]