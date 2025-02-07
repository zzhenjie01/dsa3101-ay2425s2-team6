import json
from langchain_text_splitters import RecursiveCharacterTextSplitter

'''
Takes in a list of PDF file paths as input
and returns the loaded json as a python dictionary
'''
def read_esg_jsons(lst_of_json_path):
    res = []
    for json_path in lst_of_json_path:
        with open(json_path, 'r') as f:
            res.append(json.load(f))
    return res

'''
Takes in a dictionary with
<source_path>_<page_id> of PDF as key
and page text in string as value,
chunksize, chunk_overlap and separators
as inputs and returns a dictionary as an output
through the following process:

Splits each page into smaller tokens
and returns a dictionary where
the key is <source_path>_<page_id>_<token_num>
and value as token in string format
'''
def generate_page_id_num_tokenstr_pair(
        pageid_doc_d, 
        chunksize = 200, 
        chunk_overlap = 20, 
        separators = ["\n\n", "\n", " ", ""]
    ):
    # initialise text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = chunksize,
        chunk_overlap = chunk_overlap,
        separators = separators
    )
    '''
    Splits each page into smaller tokens
    and returns a dictionary where
    the key is <source_path>_<page_id>_<token_num>
    and value as token in string format
    '''
    pageidnum_tokenstr_d = {f'{pageid}_{idx}': tokenstr\
                            for pageid, pagestring in pageid_doc_d.items()\
                            for idx, tokenstr in enumerate(text_splitter.split_text(pagestring))}
    return pageidnum_tokenstr_d