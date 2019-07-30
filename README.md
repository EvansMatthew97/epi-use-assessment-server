# EPI-USE Technical Assessment Project Server

[![Build Status](https://travis-ci.com/EvansMatthew97/epi-use-assessment-server.svg?branch=master)](https://travis-ci.com/EvansMatthew97/epi-use-assessment-server)

<a href="https://evansmatthew97.github.io/epi-use-assessment-server/" target="_blank">Documentation</a>

## Description
Server source for EPI-USE technical assessment project. The server-side code provides most core functionality of the system and a persistence layer. It provides a RESTful API endpoint to the client-side application.

Useful information regarding the use of endpoints can be found in the documentation link provided above.

This repository is configured to automatically deploy to Heroku, run unit tests and deploy documentation to Github pages.


### Technologies
This server is built using the **Nest.js framework**. It is highly modular and configurable. Because the client-side application uses Angular (TypeScript), the choice of a *TypeScript-based server framework* which follows a very similar *MVC* pattern to Angular helps reduce time shifting paradigms between working on the  client and server code bases.

**TypeORM** has been used as an object-relational mapper for this project. It provides a simple yet advanced interface between TypeScript objects and many database providers (this project uses SQLite for local development and Postgres for production). Nest.js also integrates very well with TypeORM.

**Heroku** is used to deploy this server. It provides simple continuous deployment with decent performance for free. The server API base url is [epi-use-assessment-server.herokuapp.com](https://epi-use-assessment-server.herokuapp.com).


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

***NOTE: Unit testing has not been implemented yet***

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

Valid options and descriptions are given below:

### Authentication options

- SECRET - a secret key used for JWT tokens. This should be kept secret and be reasonably long and random (string).
- ADMIN_DEFAULT_PASS - when the server first runs, there is no administrator account, hence there are no users and the system cannot be run. If no user exists, an administrator account is created with this username. (string).

### Database persistence options

- DATABASE - the name of the database (string)
- DATABASE_TYPE - the type of database (sqlite, mysql, etc.)
- DATABASE_URL - database url (contains username, password, etc. information)
