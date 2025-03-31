from stocks_prediction_lstm_func import get_predicted_stock_prices
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
BANK_STOCKS_DATA_FOLDER_DIR = os.getenv('BANK_STOCKS_DATA_FOLDER_DIR')
'''
Company name used matters as data is used to feed our dashboard
'''
companies_with_stocks = ['ANZ', 'Banco Santander', 'Bank of China', 'BOQ', 'Citigroup', 
 'Commonwealth Bank of Australia', 'DBS', 'HSBC', 'Krungthai Bank', 'Woori Bank']

'''
because of the ordering in previous list, cannot just use os.listdir()
'''
company_stock_csv_data = ['ANZ Group.csv', 'Banco Santander.csv', 'Bank Of China.csv', 'BOQ.csv', 'Citigroup.csv',
                          'Commonwealth Bank of Australia.csv', 'DBS.csv', 'HSBC.csv', 'Krungthai Bank.csv', 'Woori Financial Group.csv']

final_df_lst = []
'''
Go through each file, train LSTM model and make prediction.
Concatenate actual and predicted data together.

Final output is the combination of data from all companies.

Will upload data onto SQL database in the future.
'''
for company_name, company_filename in zip(companies_with_stocks, company_stock_csv_data):
    actual_df, forecast_df = get_predicted_stock_prices(company_filename, BANK_STOCKS_DATA_FOLDER_DIR, company_name)
    forecast_df['Price Type'] = 'Predicted'
    forecast_df = forecast_df[['Company Name', 'Price Date', 'Price Type', 'Price']]

    actual_df.columns = ['Price Date', 'Price']
    actual_df['Price Type'] = 'Actual'
    actual_df['Company Name'] = company_name
    actual_df = actual_df[['Company Name', 'Price Date', 'Price Type', 'Price']]
    final_df_by_company = pd.concat([actual_df, forecast_df])
    final_df_by_company['Price Date'] = pd.to_datetime(final_df_by_company['Price Date'], format='%d/%m/%Y %I:%M:%S %p')
    final_df_lst.append(final_df_by_company)

pd.concat(final_df_lst).to_csv('company_stock_price_data.csv', index = False)
