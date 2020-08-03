'use strict';

const express = require('express');
const app = express();
const routesPersona = require('../Persona/personaServer');
const routesFicha = require('../Ficha/fichaServer');
const routesReparaciones = require('../Reparaciones/ReparacionesServer');
const routesAccesorios = require('../Accesorios/AccesoriosServer');
const routesRepuestos = require('../Repuestos/Repuestos')

app
.use('/persona/',routesPersona)
.use('/ficha/',routesFicha)
.use('/reparaciones/', routesReparaciones)
.use('/accesorios/', routesAccesorios)
.use('/repuestos/', routesRepuestos);

module.exports = app;