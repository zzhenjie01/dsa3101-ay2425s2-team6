import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

#Key information (about the get_predicted_stock_prices function):

#2)When it comes to training the LSTM model, I decided to use 80% of the data for training and 20% of the data for testing. For the chosen_
#time_step, which is the number of data points that will be used to predict the next value, I have fixed it to 50 days. I have decided to
#also fix the number of epochs at 50, and batch size at 35 when training the LSTM model as well. I have also kept the number of days to be
#forecasted by the LSTM model at 30 days (the number of forecasted days should not be too long - results derived from the LSTM model will
#be worsened as more days are required for the prediction).

def clean_csv(company_csv_file, company_data_folder_dir):
    # will convert the Date column into a column with Datetime datatype
    stock_data = pd.read_csv(f'{company_data_folder_dir}{company_csv_file}', parse_dates = ["Date"])
    # will invert the entire dataset (the earliest date will be at the top, while the latest date will be at the bottom) 
    stock_data = stock_data.iloc[::-1].reset_index(drop = True)
    # will make the Date column become the index of the entire dataframe
    stock_data.index = stock_data.pop("Date")
    # will remove the $ from all of the columns that have the $ present in front of all of the values in the columns
    stock_data = stock_data.map(lambda x: x.replace('$', '') if isinstance(x, str) else x)
    # will convert the columns that contain strings into floats (for columns that contain data on stock prices)
    stock_data = stock_data.astype({'Close/Last' : 'float64', 'Open' : 'float64', 'High' : 'float64', 'Low' : 'float64'})
    # will focus on the Close/Last column (the column that contains the last prices at which the stock of a company is traded during regular market hours on a given day)
    stock_data_close = stock_data[["Close/Last"]]
    return stock_data_close

# Split dataset into train, test
def split_train_test_data(data):
    training_set_size = 0.8  # 80% of the data for training
    train_size = int(len(data) * training_set_size) #will get the size of the training data
    #will split the data into the data used for training and testing
    train_data = data[:train_size]
    test_data = data[train_size:]
    return train_data, test_data

# function to create the datasets for the training and testing data to be fed into LSTM
def create_dataset(data, time_step):
    X, y = [], []
    for i in range(len(data) - time_step - 1):
        X.append(data[i:(i + time_step), 0])
        y.append(data[i + time_step, 0])
    return np.array(X), np.array(y)

def train_lstm_model(X_train, y_train, X_test, y_test):
    model = Sequential()
    model.add(LSTM(units = 50, return_sequences = True, input_shape = (X_train.shape[1], 1))) #adding a LSTM layer
    model.add(Dropout(0.2)) #adding Dropout for regularization (will help to prevent overfitting)
    model.add(LSTM(units = 50, return_sequences = False))
    model.add(Dropout(0.2))
    model.add(Dense(units = 1)) #output layer that will predict the next day's stock price
    model.compile(optimizer = "adam", loss = "mean_squared_error") #will compile the model
    number_of_epochs = 5
    batch_sized = 35
    model.fit(X_train, y_train, epochs = number_of_epochs, batch_size = batch_sized, validation_data = (X_test, y_test))
    return model

def make_prediction_lstm_model(company_name, lstm_model, chosen_time_step, min_max_scaler, stock_data_close, test_data_scaled):
    #predicting the future stock prices (will forecast the prices for 30 days)
    forecasting_days = 30
    last_input = test_data_scaled[-chosen_time_step:].reshape(1, chosen_time_step, 1)
    forecasted_prices = []
    for i in range(forecasting_days):
        next_day = lstm_model.predict(last_input)
        next_day_price = min_max_scaler.inverse_transform(next_day.reshape(-1, 1))
        forecasted_prices.append(next_day_price[0, 0]) 
        last_input = np.append(last_input[:, 1:, :], next_day.reshape(1, 1, 1), axis = 1)
    forecasted_dates = pd.date_range(start = stock_data_close.index[-1] + pd.Timedelta(days = 1), periods = forecasting_days, freq = 'B')
    company_name_1 = np.full(len(forecasted_prices), company_name)
    price_date_1 = np.array(forecasted_dates)
    predicted_price_1 = np.array(forecasted_prices)
    combined_arrays_1 = np.column_stack((company_name_1, price_date_1.astype(str), predicted_price_1))
    df_1 = pd.DataFrame(combined_arrays_1)
    df_1.columns = ['Company Name', 'Price Date', 'Price']
    df_1['Price Date'] = pd.to_datetime(df_1['Price Date']).dt.date
    return df_1

'''
- company_csv_file - the name of the CSV file that contains all of historical stock prices of the different companies
- working_directory - the working directory of where the company_csv_file is stored in
- company_name - the name of the company (can determine how the company will be named)

function returns the original df with actualised prices and
another df with predicted prices

Columns are 'Company Name', 'Price Date', 'Price Type', 'Price'
'''

def get_predicted_stock_prices(company_csv_file, company_data_folder_dir, company_name):
    stock_data_close = clean_csv(company_csv_file, company_data_folder_dir)
    train_data, test_data = split_train_test_data(stock_data_close)
    scaler = MinMaxScaler(feature_range = (0, 1))
    # will fit the MinMaxscaler on the training data
    scaler.fit(train_data)
    # will transform the training data and the testing data using the MinMaxScaler that has been fitted on the training data
    train_data_scaled = scaler.transform(train_data)
    test_data_scaled = scaler.transform(test_data)
    # number of data points that will be used to predict the next value
    chosen_time_step = 50
    X_train, y_train = create_dataset(train_data_scaled, chosen_time_step)
    X_test, y_test = create_dataset(test_data_scaled, chosen_time_step)
    # will reshape the data to 3D (samples, time_steps, features) for LSTM
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
    # creating the LSTM model
    model = train_lstm_model(X_train, y_train, X_test, y_test)
    #predicting the future stock prices (will forecast the prices for 30 days)
    prediction_df = make_prediction_lstm_model(company_name, model, chosen_time_step, scaler, stock_data_close, test_data_scaled)

    prediction_df['Price Type'] = 'Predicted'
    prediction_df = prediction_df[['Company Name', 'Price Date', 'Price Type', 'Price']]

    actual_df = stock_data_close.reset_index()
    actual_df.columns = ['Price Date', 'Price']
    actual_df['Price Type'] = 'Actual'
    actual_df['Company Name'] = company_name
    actual_df = actual_df[['Company Name', 'Price Date', 'Price Type', 'Price']]
    return actual_df, prediction_df

