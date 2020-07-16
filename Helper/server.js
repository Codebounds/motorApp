'use strict';

const express = require('express');
const app = express();
const routesPersona = require('../Persona/personaServer');
const routesFicha = require('../Ficha/fichaServer');

app
.use('/persona/',routesPersona)
.use('/ficha/',routesFicha);

module.exports = app;