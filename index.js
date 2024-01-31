'use strict';

const express = require('express');
const connectMongo = require('./src/dbconnection');
// const app = express();
const app = require('./src/app');   
const port = 8010;

connectMongo();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const logger = require('./helper/winston');



app.listen(port, () => logger.info(`App started and listening on port ${port}`));