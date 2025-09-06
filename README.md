# Duel Take-Home Task

This project uses a Node.js server with Express, along with a Postgres database to store the data.
There's no front end, but it uses Swagger to show the available endpoints and to allow testing them out.

## Setup

### Prerequisites

- Docker
- Node (any recent version is fine. I used 22.14.0)

### Initial setup

- Make sure that the json data files are in the `data` directory
- Run the following commands to create the database and import the json files:
  - `docker compose up -d`
  - `npm install`
  - `npm run initialise-database` (this can take around 20 seconds)

### Running the server
- Run `npm start` to start the server
- Go to http://localhost:3000/swagger to view & use the available endpoints

### Running the tests
- Run `npm test` to run the unit tests
- Run `npm test:integration` to run the integration tests. Make sure your Docker container is running first.
