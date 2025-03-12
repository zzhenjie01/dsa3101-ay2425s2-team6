from esg_pdf_to_json_func import *
from dotenv import load_dotenv
import os

'''
main file to convert pdf to json
to shorten time to load PDF data next time
'''
if __name__ == '__main__':
    load_dotenv()
    PDF_SOURCE_DIR = os.getenv('ESG_REPORTS_FOLDER')
    PDF_DEST_DIR = os.getenv('ESG_REPORTS_JSON_FOLDER')
    # Create the destination directory if it does not exist
    if not os.path.exists(PDF_DEST_DIR):
        os.makedirs(PDF_DEST_DIR)
    lst_of_pdf_names = os.listdir(PDF_SOURCE_DIR)
    lst_of_loaded_pdfs = [load_docs(f'{PDF_SOURCE_DIR}{filepath}') for filepath in lst_of_pdf_names]
    lst_of_page_doc_pair = [generate_page_doc_pair(pdf) for pdf in lst_of_loaded_pdfs]
    save_esg_data_as_json(lst_of_pdf_names, lst_of_page_doc_pair, PDF_DEST_DIR)