'use strict';

const express = require('express');
const app = express();
const routes = require('./personaServer');

app.use('/persona/',routes);

module.exports = app;