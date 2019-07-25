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


## Generating Documentation
This project is configured to use compodoc.
To generate documentation, run:
```
$ npm run doc
```

## Configuration
All system configuration is stored in the system environment.
These properties can be overridden using the `.env` file.

An example .env file is given at `/.env.example`

### Valid options and descriptions:
- DATABASE - the name of the database (string)
- DATABASE_TYPE - the type of database (sqlite, mysql, etc.)
- DATABASE_URL - database url (contains username, password, etc. information)
