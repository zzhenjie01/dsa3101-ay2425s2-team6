#%%
from pyspark.sql import SparkSession
from langchain_text_splitters import RecursiveCharacterTextSplitter
import json
import sparknlp
from sparknlp.base import *
from sparknlp.annotator import *
from pyspark.ml import Pipeline
from pyspark.sql.functions import udf
import os
from dotenv import load_dotenv
from pyspark.sql.functions import concat_ws
#%%

# Initialize Spark NLP session which is built on Apache Spark for NLP tasks
spark = sparknlp.start()

#%%

# Load the environmental variables
load_dotenv()
ESG_REPORTS_JSON_DIR = os.getenv('ESG_REPORTS_JSON_FOLDER')
ESG_REPORTS_CSV_DIR = os.getenv('ESG_REPORTS_CSV_FOLDER')

# Create the output directory if it does not exist
if not os.path.exists(ESG_REPORTS_CSV_DIR):
    os.makedirs(ESG_REPORTS_CSV_DIR)

#%%
#================ Define the NLP Pipeline =================

# Converts the `text` column to `Document` type so that Spark NLP can process
documentAssembler = DocumentAssembler() \
    .setInputCol("text") \
    .setOutputCol("document")

# Splits the `document` into smaller chunks of text
# `.setchunkSize()` parameter specifies the maximum number of characters in each chunk
# `.chunkOverlap()` parameter specifies the number of characters to overlap between chunks
# to avoid losing context.
documentSplitter = DocumentCharacterTextSplitter() \
    .setInputCols("document") \
    .setOutputCol("chunks") \
    .setChunkSize(200) \
    .setChunkOverlap(10)

# Tokenizes the `chunks` into individual words or tokens
tokenizer = Tokenizer() \
    .setInputCols("chunks") \
    .setOutputCol("tokens")

# Extracts keywords form the tokens using YAKE (Yet Another Keyword Extractor) algorithm
# `.setNKeywords(10)` specifies the top 10 keywords should be extracted
keywordExtractor = YakeKeywordExtraction() \
    .setInputCols("tokens") \
    .setOutputCol("keywords") \
    .setNKeywords(10)

# Converts the
finisher = Finisher() \
    .setInputCols("keywords")

# Create the Spark NLP Pipeline with the defined stages
pipeline = Pipeline().setStages([
    documentAssembler,
    documentSplitter,
    tokenizer,
    keywordExtractor,
    finisher
])

#%%
# ============ Process the JSON files using Spark NLP ============

def main():
    # Iterate over the files in the JSON directory
    for filename in os.listdir(ESG_REPORTS_JSON_DIR):
        # Check if the file is a JSON file and load it
        if filename.endswith('.json'):
            with open(f'{ESG_REPORTS_JSON_DIR}/{filename}', 'r') as f:
                data = json.load(f)
            
            # Create a Spark DataFrame from the JSON data with columns `id` and `text`
            # Each key-value pair in the JSON data is a row in the DataFrame
            spark_df = spark.createDataFrame(data.items(), ["id", "text"])

            # Fit the pipeline to the Spark DataFrame and transform the data, applying the NLP stages
            output_df = pipeline.fit(spark_df).transform(spark_df)

            # Renames the `text` column to `text_chunk` and `finished_keywords` to `tags`
            # This is so that we don't confuse the `text` column with `text` 
            # and `finished_keywords` with `keyword` data type in Elasticsearch later on
            output_df = output_df.withColumnRenamed("text", "text_chunk") \
                                .withColumnRenamed("finished_keywords", "tags") 

            # Converts the array of strings in the `tags` column to a single string
            # with each keyword separated by a comma
            output_df = output_df.withColumn("tags", concat_ws(", ", "tags"))

            # Drop any rows with null values
            output_df = output_df.dropna()

            # Save the Spark DataFrame as a CSV file
            output_filename = filename.replace('.json', '.csv')
            output_df = output_df.toPandas()
            output_df.to_csv(f'{ESG_REPORTS_CSV_DIR}/{output_filename}', index=False)
# %%
if __name__ == '__main__':
    main()
