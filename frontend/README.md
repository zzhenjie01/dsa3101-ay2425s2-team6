# Frontend

This folder will contain all the relevant files required to set up the Web Application's Frontend.
Details regarding the set-up of the Frontend Application can be found in the project's main README page.

## Brief Overview of Application

- Home Page to explain what this project is about
- Dashboard Page to show the ESG metrics for the various companies, as well as their Stock Price and ESG trends
- Leaderboard Page to show the top companies based on the user preferences, as well as a Recommendation Section to recommend companies to the user based on other similar user's viewing history
- User Authentication system for users to register and login to our Web Applcation
- Chatbot Feature for users to ask about the various companies and their ESG performance

## Navigating the `src` folder:

- `assets` folder: Contains the images used in our Web Application
- `components` folder: Contains the various components used in our Web Application
  - `chatbot` folder: Contains all the component files for our Chatbot Feature
  - `dashboard` folder: Contains all the component files for our Dashboard Page
  - `helpers` folder: Contains helper functions used by the components
  - `icons` folder: Contains icon components used by some of the Dashboard components
  - `leaderboard` folder: Contains all the component files for our Leaderboard Page
  - `misc` folder: Contains all other component files essential for our Web Application
  - `ui` folder: Contains shadcn and animation components used in our Web Application
- `context` folder: Contains the context hooks for our Web Application
- `lib` folder: Contains the function necessary for our shadcn components
- `pages` folder: Contains all the page files for our Web Application
- `services` folder: Contains mainly the service for storing Chatbot messages
- Other files
  - `App.jsx` file: Controls the layout of our Web Application
  - `index.css` file: Contains the global css configurations for our Web Application
  - `main.jsx` file: Contains the root of our Web Application
  - `Routes.jsx` file: Sets up all the Routes for the various pages of our Web Application

## Instructions to use Web App:

Have `Node.js` and `npm` package manager installed.

1. Install frontend dependencies from `package.json` by running the following command in current directory

    ```shell
    npm install
    ```

2. Start the app in development mode using the following command in current directory

    ```shell
    npm run dev
    ```

3. Once done using make sure to `Ctrl+C` in terminal to exit
