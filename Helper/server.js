'use strict';

const express = require('express');
const app = express();
const routesPersona = require('../Persona/personaServer');
const routesFicha = require('../Ficha/fichaServer');
const routesReparaciones = require('../Reparaciones/ReparacionesServer');

app
.use('/persona/',routesPersona)
.use('/ficha/',routesFicha)
.use('/reparaciones/', routesReparaciones);

module.exports = app;