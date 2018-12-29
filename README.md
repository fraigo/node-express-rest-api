# Node.js/Express REST API

A base project to implement a RESTful API using Node.js and Express server.

## Features

* SQLite Database storage 
* Token-based authentication (Bearer)
* Implements basic login and session info:
  * POST /api/auth/login : Login using email and password
  * GET /api/auth/me : Check login session status
* Implements basic REST operations endpoints for users:
  * POST /api/user : Create a new user
  * PUT /api/user/:id : Update an existing user
  * GET /api/users : List current users (with optional filters)
  * GET /api/user/:id : Retrieve data from a specific user by id
  * DELETE /api/user/:id : Delete a user by id
* Unit tests for each REST operations


## Node.js Packages

* [express](https://www.npmjs.com/package/express): A Fast, and minimalist web framework for Node.js 
* [sqlite3](https://www.npmjs.com/package/sqlite3): A Node.js SQLite database interface  
* [md5](https://www.npmjs.com/package/md5): Provides basic MD5 hashing for passwords
* [mocha](https://www.npmjs.com/package/mocha): JavaScript test framework for Node.js
* [chai](https://www.npmjs.com/package/chai): A BDD / TDD assertion library for node 
* [chai-http](https://www.npmjs.com/package/chai-http): HTTP integration testing with Chai assertions.

## Project commands

### Run a local Express server 

`npm run start`

* After running for first time, a new file `data/db.sqlite` will be created.
* You can access the local server at `http://localhost:8000/`


### Run tests with Mocha and Chai

`npm run test`





