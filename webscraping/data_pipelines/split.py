### SPLITTING TEXT INTO SMALLER CHUNKS

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
import pandas as pd

# Ensure file path is correct
csv_file = r"C:\Users\jiayi\OneDrive - National University of Singapore\Desktop\DSA3101\esg_articles.csv"


def split_text(df):
    """Split scraped article text into smaller chunks for better processing"""

    # load csv into df
    df = pd.read_csv(csv_file)

    # initialize text splitter
    text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1200, chunk_overlap=100, add_start_index=True
    )

    # create a list to store the documents objects
    documents = []

    # loop the rows of the df and convert them into Document format
    for index, row in df.iterrows():
    
        # check if content is valid (not NaN or 'Unable to scrape text')
        if pd.notna(row['Content']) and row['Content'] != 'Unable to scrape text':
            document = Document(page_content=row['Content'], metadata={'title': row['Title'], 'source': row['Source'], 'url': row['URL']})
            documents.append(document) # append to documents list

    all_splits = text_splitter.split_documents(documents) # all_splits now contains the chunked text content

    return all_splits


