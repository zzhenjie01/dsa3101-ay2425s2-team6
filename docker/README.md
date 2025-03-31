# Docker folder

This folder contains all the information you need for our docker containers.
We have the following containers:
1) ElasticSearch
2) MongoDB
3) PostgreSQL
4) Spark (not in use)

Environment variables are as follows:
```
MONGODB_USERNAME=root
MONGODB_PASSWORD=root
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
```

Remember to run
```
docker cp ./companies_stock_price_data.csv postgres:/var/lib/postgresql/data
```
if you intend to use the web app because this command copy sample stock data into PSQL which is then retrieved and visualised on the dashboard.