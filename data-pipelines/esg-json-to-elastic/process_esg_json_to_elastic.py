import os
if __name__ == '__main__':
    json_folder_dir = 'data/esg-json/'
    lst_of_json_filename = os.listdir(json_folder_dir)
    lst_of_json_paths = [json_folder_dir + json_filename \
                         for json_filename in lst_of_json_filename]