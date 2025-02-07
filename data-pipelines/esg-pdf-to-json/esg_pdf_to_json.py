from esg_pdf_to_json_func import *

if __name__ == '__main__':
    pdf_source_dir = '../data/esg-pdf/'
    lst_of_pdf_names = os.listdir(pdf_source_dir)
    lst_of_loaded_pdfs = [load_docs(f'{pdf_source_dir}{filepath}') for filepath in lst_of_pdf_names]
    lst_of_page_doc_pair = [generate_page_doc_pair(pdf) for pdf in lst_of_loaded_pdfs]
    save_esg_data_as_json(lst_of_pdf_names, lst_of_page_doc_pair, '../data/esg-json/')