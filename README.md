# 🤖 automating-esg-data-extraction-and-performance-analysis

## Repository Description

This repository contains the code, documentation, and resources for Group 6 of the NUS course DSA3101: Data Science in Practice for the AY24/25 Semester 2.

## Project Description

This project aims to design an automated ESG data extraction and performance evaluation system through the use of Natural Language Processing techniques.

## Project Overview

## 🚀 Getting Started & Setting Up

To launch the application, you will need to do the following steps:

1. At the main folder directory, change your directory into backend folder by running `cd backend`.
2. Install the necessary packages by doing `npm install`.
3. Once installed, you may proceed to run the backend server by doing `npm run start`.
   1. This will run docker compose up to set up the MongoDB for storing user credentials, and start the express server to handle API requests.
   2. If you receive a `unable to get image 'mongo:latest': error during connect:` error, please ensure that your Docker Desktop is running in the background and try again.
4. After setting up the backend services, you can now go to the frontend folder by running either `cd ../frontend` in the current directory or opening a new terminal and running `cd frontend` at the main folder directory.
5. Install the necessary packages by doing `npm install`.
6. Once installed, you may proceed to launch the webapp by running `npm run dev`. You should be able to access the webapp at `http://localhost:5173`.
7. Once you are done with the webapp, you should run `npm run end` at the backend folder directory to stop the MongoDB server.
   1. This will run docker compose down to stop the current MongoDB and will save the user data for future use.

## 🌀 Run Models

## 🧊 Contributing

All contributions are to be merged to main via pull request.

### Branches

- branches recommended to follow the following format: `<username>-<feature>-<subfeature>`
  - `<name>`: GitHub username or any name that is easy to identify the owner of the branch. Strictly no spaces and all letters in lowercase.
  - `<feature>`: The name of the feature that the code is meant for.
  - `<subfeature>`: Optional input. Depends on whether the main feature is being broken down into subfeatures due to its complexity.
- For example: nghockleong-loginpage-userauthentication

### Commit Messages

Be clear and concise with the intent of the commit.

### Coding guidelines

Follows general software engineering practices. Some examples of good practices are as follows:

- Clear documentation for code written
- Meaningful function and variable names
- Refactor overly complex code into smaller chunks of code
- Code should avoid being interdependent (Changing 1 code chunk does not require huge changes across other code chunks and modules)
- Adhere to official style guides for all languages to the best of your ability.
  - Python style guide: [PEP 8 - Python Style Guide](http://www.python.org/dev/peps/pep-0008)
- Do not push your secrets such as API keys to GitHub; store them in a `.env` file instead.
- Do not push model checkpoint or weights files (`.pth` or `.pt`) to GitHub as you most likely won't succeed due to the large file size.
- Do not push datasets to GitHub as it may cuz the changes count to explode on GitHub.

## 🌐 Repository Structure

## 📋 Documentations
