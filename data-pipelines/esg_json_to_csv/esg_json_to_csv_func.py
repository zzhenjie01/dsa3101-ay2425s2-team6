from sparknlp.base import *
from sparknlp.annotator import *
from pyspark.ml import Pipeline
from pyspark.sql.functions import concat_ws
import json

#================ Define the NLP Pipeline =================
def generate_nlp_pipeline():
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
    return pipeline

def convert_esg_json_to_csv(json_folder_dir, json_file, spark_instance, pipeline):
    if json_file.endswith('.json'):
        with open(f'{json_folder_dir}/{json_file}', 'r') as f:
            data = json.load(f)
        spark_df = spark_instance.createDataFrame(data.items(), ["id", "text"])
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
        output_df = output_df.toPandas()
        return output_df