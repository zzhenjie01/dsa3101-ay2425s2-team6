#!/usr/bin/env python
# coding: utf-8

# In[26]:


#Import all of the necessary packages, models etc.
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.model_selection import train_test_split


# In[27]:


#Key information (about the get_predicted_stock_prices function):

#1)Arguments for the get_predicted_stock_prices function: 
#- company_csv_file - the name of the CSV file that contains all of historical stock prices of the different companies
#- working_directory - the working directory of where the company_csv_file is stored in
#- company_name - the name of the company (can determine how the company will be named)

#2)When it comes to training the LSTM model, I decided to use 80% of the data for training and 20% of the data for testing. For the chosen_
#time_step, which is the number of data points that will be used to predict the next value, I have fixed it to 50 days. I have decided to
#also fix the number of epochs at 50, and batch size at 35 when training the LSTM model as well. I have also kept the number of days to be
#forecasted by the LSTM model at 30 days (the number of forecasted days should not be too long - results derived from the LSTM model will
#be worsened as more days are required for the prediction).


# In[53]:


def get_predicted_stock_prices(company_csv_file, working_directory, company_name):
    os.chdir(working_directory)
    stock_data = pd.read_csv(company_csv_file, parse_dates = ["Date"]) #will convert the Date column into a column with Datetime datatype
    stock_data = stock_data.iloc[::-1].reset_index(drop = True) #will invert the entire dataset (the earliest date will be at the top, while the latest date will be at the bottom) 
    stock_data.index = stock_data.pop("Date") #will make the Date column become the index of the entire dataframe
    columns_to_modify = ["Close/Last", "Open", "High", "Low"]
    stock_data = stock_data.map(lambda x: x.replace('$', '') if isinstance(x, str) else x) #will remove the $ from all of the columns that have the $ present in front of all of the values in the columns
    stock_data = stock_data.astype({'Close/Last' : 'float64', 'Open' : 'float64', 'High' : 'float64', 'Low' : 'float64'}) #will convert the columns that contain strings into floats (for columns that contain data on stock prices)
    stock_data_close = stock_data[["Close/Last"]] #will focus on the Close/Last column (the column that contains the last prices at which the stock of a company is traded during regular market hours on a given day)
    training_set_size = 0.8  # 80% of the data for training
    train_size = int(len(stock_data_close) * training_set_size) #will get the size of the training data
    #will split the data into the data used for training and testing
    train_data = stock_data_close[:train_size]
    test_data = stock_data_close[train_size:]
    scaler = MinMaxScaler(feature_range = (0, 1))
    scaler.fit(train_data) #will fit the MinMaxscaler on the training data
    #will transform the training data and the testing data using the MinMaxScaler that has been fitted on the training data
    train_data_scaled = scaler.transform(train_data)
    test_data_scaled = scaler.transform(test_data)
    chosen_time_step = 50 #number of data points that will be used to predict the next value
    def create_dataset(data, time_step = chosen_time_step): #function to create the datasets for the training and testing data
        X, y = [], []
        for i in range(len(data) - time_step - 1):
            X.append(data[i:(i + time_step), 0])
            y.append(data[i + time_step, 0])
        return np.array(X), np.array(y)
    X_train, y_train = create_dataset(train_data_scaled, chosen_time_step)
    X_test, y_test = create_dataset(test_data_scaled, chosen_time_step)
    #will reshape the data to 3D (samples, time_steps, features) for LSTM
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)
    #creating the LSTM model
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
    #predicting the future stock prices (will forecast the prices for 30 days)
    forecasting_days = 30
    last_input = test_data_scaled[-chosen_time_step:].reshape(1, chosen_time_step, 1)
    forecasted_prices = []
    for i in range(forecasting_days):
        next_day = model.predict(last_input)
        next_day_price = scaler.inverse_transform(next_day.reshape(-1, 1))
        forecasted_prices.append(next_day_price[0, 0]) 
        last_input = np.append(last_input[:, 1:, :], next_day.reshape(1, 1, 1), axis = 1)  
    forecasted_dates = pd.date_range(start = stock_data.index[-1] + pd.Timedelta(days = 1), periods = forecasting_days, freq = 'B') #will get the
    #dates of the forecasted prices
    #1)Output is a Pandas DataFrame that contains the forecasted prices, dates used for the forecasted prices and the company name
    company_name_1 = np.full(len(forecasted_prices), company_name)
    price_date_1 = np.array(forecasted_dates)
    predicted_price_1 = np.array(forecasted_prices)
    combined_arrays_1 = np.column_stack((company, dates.astype(str), prices))
    df_1 = pd.DataFrame(combined_arrays_1)
    df_1.columns = ['Company Name', 'Forecasted Price Date', 'Forecasted Price']
    df_1['Forecasted Price Date'] = pd.to_datetime(df_1['Forecasted Price Date']).dt.date
    return df_1
    #2)Output is a line graph showing the predicted stock prices (will show the line graph of the stock prices being extrapolated using the
    #predicted stock prices)
    #def plot_graph(stock_data = stock_data, stock_data_close = stock_data_close, forecasted_dates = forecasted_dates, forecasted_prices = forecasted_prices): #function that will plot out the graph containing the existing stock prices and the forecasted stock prices (for 30 days)
        #plt.figure(figsize = (14, 6))
        #plt.plot(stock_data.index, stock_data_close["Close/Last"], color = "blue", label = "Past stock prices")
        #plt.plot(forecasted_dates, forecasted_prices, color = "green", label = "Forecasted stock prices")
        #plt.title(f'Forecasting stock price for 30 days for {company_name} using LSTM')
        #plt.xlabel("Date")
        #plt.ylabel("Stock Price")
        #plt.legend()
        #return plt.show()
    #return plot_graph()


# In[ ]:


#company_csv_file_name = 
#your_working_directory =
#company_name =
#get_predicted_stock_prices(company_csv_file, your_working_directory, company_name)


# In[ ]:


#Some questions that I have:
#1) Where do I put all of the CSV files containing the historical stock prices of the different companies (e.g. put it in the data etc.)?
#2) What should the overall output of my function be (e.g. is it supposed to be the line graph that shows the forecasted stock prices)??

