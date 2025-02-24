# MongoDB to store user login credentials (purpose of this subfolder for now)

Pre-requisite to start mongoDB:
Docker locally (just download Docker Desktop to simplify set up)

Steps to use mongoDB image:
1) create .env file and store mongoDB user and password as `MONGODB_USERNAME` and `MONGODB_PASSWORD`
2) run `docker compose up -d` to start up mongoDB. This creates a mongodb_data/ folder (bind mount) which stores persistent data after stopping the container.
3) run `docker exec -it mongodb mongosh -u <username> -p <password>`. This will bring you into the mongoDB shell within the Docker environment which allows you to interact with the database.

Ways to interact with DB:
1) ORM via javascript (mongoose API)
2) through shell commands (from step 3 above)
