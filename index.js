'use strict';

const express = require('express');
const connectMongo = require('./src/dbconnection');
// const app = express();
const app = require('./src/app');   
const port = 8010;

connectMongo();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(':memory:');

// const buildSchemas = require('./src/schemas');

// db.serialize(() => {
//     buildSchemas(db);

//     const app = require('./src/app')(db);

// });
    app.listen(port, () => console.log(`App started and listening on port ${port}`));