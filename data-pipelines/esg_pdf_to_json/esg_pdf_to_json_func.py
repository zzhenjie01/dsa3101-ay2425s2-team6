from langchain_community.document_loaders import PyPDFLoader
import os
import json

'''
Takes relative or absolute filepath of .pdf file as input
and returns list of Document objects,
each Document representing 1 page of the .pdf file
'''
def load_docs(filepath):
    loader = PyPDFLoader(filepath)
    doc = loader.load() 
    return doc

'''
Takes Document object as input
and returns a tuple pair of id, page_content of the page
where id is made from <filename>_<page_num>
'''
def process_page(pg):
    return f"{pg.metadata['source']}_{pg.metadata['page']}", pg.page_content

'''
Takes in list of Document objects as input
and returns a dictionary containing
<filename>_<page_num> as key and
page content as value
'''
def generate_page_doc_pair(loaded_document):
    return {pg_id: pg_doc for pg_id, pg_doc in map(process_page, loaded_document)}

'''
Takes in a list of .pdf filename strings,
its corresponding list of dictionaries where each dictionary represents 1 .pdf file
,folder directory of the destination .json
and saves them in the provided destination
'''
def save_esg_data_as_json(filename_lst, page_doc_pair_lst, folder_dir):
    for filename, doc_dict in zip(filename_lst, page_doc_pair_lst):
        json_filename = f"{folder_dir}{filename.strip('.pdf')}.json"
        with open(json_filename, 'w') as file:
            json.dump(doc_dict, file, indent = 4)