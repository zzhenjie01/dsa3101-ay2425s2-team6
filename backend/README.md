# Backend

This folder will contain all the relevant files required to set up the Web Application's Backend.
Details regarding the set-up of the Backend server can be found in the project's main README page.

## Brief Overview of Services:

- Express Server to receive and handle API calls from the frontend
- MongoDB - Contains the Company and User collections
- PostgreSQL DB - Contains the Weight Transactions, Click Transactions and Company Stock Price data tables

## Navigating the `src` folder:

- `api` folder
  - `controllers` folder: Contains all the functions (and helper) which will be executed whenever the API routes are called
  - `misc` folder: Contains the Guest Profile configuration to be used in the respective controllers
  - `models` folder: Contains the MongoDB collections and PostgreSQL pool configuration
  - `routes` folder: Defines the various API routes
- Other files
  - `esgScoresHelper.js` file: Contains helper functions to calculate required values for our `mongoDB.js` file
  - `mongoDB.js` file: Connects to MongoDB and sets up the collections as required
  - `pgDB.js` file: Creates the necessary tables and data in our Postgre Database
  - `server.js` file: Does the entire set-up of our backend services
