# Demo eCommerce DB Migrations
This repo holds DB migration scripts used by [demo-ecommerce-backend](https://github.com/IvanDimanov/demo-ecommerce-backend).

## [Database schema](https://dbdiagram.io/d/5fa78a6e3a78976d7b7af67f)
## [![App](https://raw.githubusercontent.com/IvanDimanov/demo-ecommerce-db-migrations/master/image.png)](https://dbdiagram.io/d/5fa78a6e3a78976d7b7af67f)

## Tech stack
- sequelize: [https://sequelize.org/](https://sequelize.org/)
- joi: [https://www.npmjs.com/package/joi](https://www.npmjs.com/package/joi)

## Run locally
App can be run locally using docker and [this repo](https://github.com/IvanDimanov/demo-ecommerce-local-env). <br />
Executing the script below will set up the DB on your local machine:
```
git clone git@github.com:IvanDimanov/demo-ecommerce-db-migrations.git
cd ./demo-ecommerce-db-migrations
npm ci
cp .env.example .env
npm run db-setup
```
