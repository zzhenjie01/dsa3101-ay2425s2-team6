from .esg_pdf_to_json_func import *
import os

'''
main file to convert pdf to json
to shorten time to load PDF data next time
'''
def esg_pdf_to_json(pdf_source_dir, json_dest_dir):
    # Create the destination directory if it does not exist
    if not os.path.exists(json_dest_dir):
        os.makedirs(json_dest_dir)
    lst_of_pdf_names = os.listdir(pdf_source_dir)
    lst_of_loaded_pdfs = [load_docs(f'{pdf_source_dir}{filepath}') for filepath in lst_of_pdf_names]
    lst_of_page_doc_pair = [generate_page_doc_pair(pdf) for pdf in lst_of_loaded_pdfs]
    save_esg_data_as_json(lst_of_pdf_names, lst_of_page_doc_pair, json_dest_dir)