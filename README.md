# EPI-USE Technical Assessment Project

## Description



## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Configuration
### Database
The `ormconfig.json` file is used to configure the database.
Example configuration:
```
{
  "type": "mysql",
  "host": "127.0.0.1",
  "port": 3306,
  "username": "root",
  "password": "",
  "database": "epi-use-db",
  "entities": ["src/**/*.entity.ts"],
  "synchronize": "true"
}
```