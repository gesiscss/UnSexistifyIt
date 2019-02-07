<!-- ### UNSEXIFY GAME, a full MEAN stack project

# Install and Run MongoDB

- Download MongoDB, visit http://mongodb.org/downloads
- Run MongoDB on OSX, visit https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb
- Run MongoDB on Windows, visit https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition

# Install Node.js

- Download  and Install Node.js, visit http://nodejs.org/download/
- To check if you have Node.js installed, run node -v in your terminal
- To confirm that you have npm installed run npm -v in your terminal: 

# Install NPM packages

- Navigate to the project folder
- To install all dependency packages, run this command in your terminal: npm install

# Restore DB

- Restore database dump created by mongodump
- Dump folder is located inside the game directory.
- backup: sudo mongodump --db newdb --out /Users/Ali/game/DbDump/`date +"%m-%d-%y"`
- restore: sudo mongorestore --db game --drop /Users/Ali/game/DbDump/07-30-18/game/

# Run

- To start the project, run one of those commands in your terminal: nodemon / npm start
- To visit the project, navigate to http://localhost:3000/ in your browser

# Load test on the selected HTTP or WebSockets URL

- https://www.npmjs.com/package/loadtest#complete-example
- Run in console window: testserver-loadtest
- On a different console window: loadtest http://localhost:7357/ -t 120 -c 50 --rps 500 (load test against it for 120 seconds with concurrency 50 and 500 requestsPerSecond)

 -->

 # UnSexistifyIt Game

A language game which aims to convert sexist statements into non-sexist.

## Installation

- Download and Install [MongoDB](http://mongodb.org/downloads).

- Download and Install [Node.js](https://nodejs.org/en/download/).


## Usage

- To install all dependency packages, navigate to the main project directory and run
```bash
npm install
```

- Make sure Mongo is running on tour system. How to run MongoDB on [Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#run-mongodb-community-edition), [OSX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#run-mongodb), and [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition)

- To start the project, run
```bash
npm start
```
- Navigate to http://localhost:5000/ in your browser to play the game