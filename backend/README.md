# Backend

This folder will contain all the relevant files required to set up the Web Application's Backend.
Details regarding the set-up of the Backend server can be found in the project's main README page.

## Brief Overview of Services:

- Express Server to receive and handle API calls from the frontend
- MongoDB - Contains the Company and User collections
- PostgreSQL DB - Contains the Weight Transactions, Click Transactions and Company Stock Price data tables

## Navigating the `src` folder:

- `api` folder: Contains all the functions and routes for our Express server to receive and handle API requests
  - `controllers` folder: Contains all the functions (and helper) which will be executed whenever the API routes are called
  - `misc` folder: Contains the Guest Profile configuration to be used in the respective controllers
  - `models` folder: Contains the MongoDB collections and PostgreSQL pool configuration
  - `routes` folder: Defines the various API routes
- Other files
  - `esgScoresHelper.js` file: Contains helper functions to calculate required values for our `mongoDB.js` file
  - `mongoDB.js` file: Connects to MongoDB and sets up the collections as required
  - `pgDB.js` file: Creates the necessary tables and data in our Postgre Database
  - `server.js` file: Does the entire set-up of our backend services

## Our Core Backend Components:

1) MongoDB container
2) PostgreSQL container
3) Web app backend

## Instructions to Turn on Backend

### Pre-requisites:

1) [Docker Desktop](https://www.docker.com/products/docker-desktop/) to run MongoDB and PostgreSQL containers
2) [Node.js](https://nodejs.org/en/download) with `npm` installed
3) `.env` file with the following variables in this folder:

```text
MONGODB_USERNAME=root
MONGODB_PASSWORD=root
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
EXPRESS_PORT=5000
JWT_KEY="testing"
```

### 1. Start MongoDB and PSQL Docker Container

Make sure Docker Desktop is running in background. Open terminal and head over to `docker/` and run the following command. It will automatically pull the `mongodb` and `postgres` images from Docker if it is not already in your system, and then create running containers for both services.

```shell
docker compose up -d
```

### 2. Copying of Stock Data into PSQL

Within `docker/` folder, copy the stocks data csv `companies_stock_price_data.csv` into the PSQL container using the following command:

```shell
docker cp ./companies_stock_price_data.csv postgres:/var/lib/postgresql/data
```

### 3. Creation of MongoDB User

Ensure that inside your `docker/` folder, you already have the following `.env` file.

```text
MONGODB_USERNAME=root
MONGODB_PASSWORD=root
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
```
> [!IMPORTANT]
> Since we are running this for the first time, we need to set up the appropriate user for our MongoDB instance, as it is not created previously. 

This means that running the following command will lead to an error. The command is of the structure: `docker exec -it [CONTAINER_NAME] mongosh -u [MONGODB_USERNAME] -p [MONGODB_PASSWORD]`

```shell
docker exec -it mongodb mongosh -u root -p root
```

**Example of error:**

![MongoDB Authentication Error](./attachments/MongoDB_User_Authentication_Failed.png)

> [!NOTE]
> This error means that we have not created the aforementioned user called `root` yet. Hence, we will need to create it.

1. Go into the terminal without any authentication by running the following command:

    ```shell
    docker exec -it mongodb mongosh
    ```

    **Example:**
    ![MongoDB Shell Without Authentication](./attachments/MongoDB_No_Authentication.png)

2. Then, in the terminal, we will go into the admin database, and create the user using the following commands:

    ```shell
    use admin
    ```

   ![Use Admin Database](./attachments/MongoDB_Use_Admin.png)

    ```shell
    db.createUser({user: <MONGODB_USERNAME>, pwd: <MONGODB_PASSWORD>, roles:["root"]})
    ```

   **Example:**
   ![Creating root user](./attachments/MongoDB_Create_Root_User.png)

> [!IMPORTANT]
> It is important that we specify `<MONGODB_USERNAME>` and `<MONGODB_PASSWORD>` in the above command to be the same as the `MONGODB_USERNAME` and `MONGODB_PASSWORD` specified in the `.env` file. If not there will be error when connecting to MongoDB server.

   Once done, the user should be created properly. You may check this by exiting the `mongosh` terminal, and run the `docker exec -it mongodb mongosh -u root -p root` command in the `/backend` folder directory, which should be successful now.

### 4. Install Backend Libraries

Run the following command from this directory to install dependencies for web app backend.

```shell
npm install
```

### 5. Running of Backend Server

Run the server script from this directory using the following command:

```shell
node src/server.js
```
> [!CAUTION]
> The backend server should start up. It may seem like it is hanging (cursor not blinking) but it is normal. For subsequent tasks, open a new terminal and don't touch this terminal once it is started up. Once you are done using the web app, remember to shutdown the backend using `Ctrl+C` in the terminal

> [!IMPORTANT]
> Shutting down your servers after you are done with the application is important.
> Failure to do so can cause issues later down the road, such as errors during the set-up of the backend server.
> An example: https://stackoverflow.com/questions/54922433/postgresql-fatal-the-database-system-is-starting-up-windows-10