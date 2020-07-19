'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@motorapp.4hjcl.mongodb.net/MotorApp?retryWrites=true&w=majority';

api.use(bodyParser.urlencoded({extended: false}));

const reparacionesSchema = new mongoose.Schema({
    orden: String,
    nombre: String,
    valor: String,
    prioridad: String,//BAJA - MEDIA - ALTA
    estadoTaller: String, //SIN DEFINIR - COMPRADO - POR COMPRAR
    estadoCliente: String,//SIN DEFINIR - ACEPTADO - RECHAZADO
    lugar: String//SIN DEFINIR - TALLER - TIENDA
});

api.post('/saveRepuesto', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var prioridad = req.body.prioridad;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro repuesto es obligatorio"});
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
    }

    if (prioridad == "" || prioridad == null){
        res.status(401).json({"reason":"El parametro prioridad es obligatorio"});
    }

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Reparacion = mongoose.model('Reparacion', reparacionesSchema);
            const nuevaReparacion = new Reparacion({ 
                orden: orden,
                nombre: nombre,
                prioridad: prioridad,
                valor: "SIN DEFINIR",
                estadoTaller: "SIN DEFINIR",
                estadoCliente: "SIN DEFINIR",
                lugar: "SIN DEFINIR"
            });
            nuevaReparacion.save().then(doc => {
                res.status(200).json();
            })
            .catch(err => {
                res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        })
});

api.post('/getPrereforma', (req,res) => {
    var orden = req.body.orden;

    if (orden == null || orden == ""){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
    }

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', reparacionesSchema)
            Reparacion.find({
                orden: orden
            })
            .then(reparaciones => {
                if (reparaciones.length > 0){
                    res.status(200).json({reparaciones});
                } else {
                    res.status(401).json({"reason":"No hay reparaciones disponibles"});
                }
            })
            .catch(err => {
                res.status(500).json({"reason":"Error en base de datos"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
        })
});

api.post('/updateEstadoCliente', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var estadoCliente = req.body.estadoCliente;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
    }

    if (estadoCliente == "" || estadoTaller == null){
        res.status(401).json({"reason":"El parametro estadoCliente es obligatorio"});
    }

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', reparacionesSchema);
            Reparacion.findOne({
                orden: orden,
                nombre: nombre
            }, function(err, repuesto){
                if(repuesto != null){
                    repuesto.estadoCliente = estadoCliente
                    repuesto.save().then(repuesto => {
                        res.status(200).json();
                    })
                    .catch(err => {
                        res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
                    })
                } else {
                    res.status(400).json({"reason":"No existe usuario asociado a este número de cédula"});
                }
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
        })
})

api.post('/updateEstadoTaller', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var estadoTaller = req.body.estadoTaller;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
    }

    if (estadoTaller == "" || estadoTaller == null){
        res.status(401).json({"reason":"El parametro estadoTaller es obligatorio"});
    }

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', reparacionesSchema);
            Reparacion.findOne({
                orden: orden,
                nombre: nombre
            }, function(err, repuesto){
                if(repuesto != null){
                    repuesto.estadoTaller = estadoTaller
                    repuesto.save().then(repuesto => {
                        res.status(200).json();
                    })
                    .catch(err => {
                        res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
                    })
                } else {
                    res.status(400).json({"reason":"No existe usuario asociado a este número de cédula"});
                }
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
        })
})

api.post('/updateValor', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var valor = req.body.valor;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
    }

    if (valor == "" || valor == null){
        res.status(401).json({"reason":"El parametro valor es obligatorio"});
    }

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', reparacionesSchema);
            Reparacion.findOne({
                orden: orden,
                nombre: nombre
            }, function(err, repuesto){
                if(repuesto != null){
                    repuesto.valor = valor
                    repuesto.save().then(repuesto => {
                        res.status(200).json();
                    })
                    .catch(err => {
                        res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
                    })
                } else {
                    res.status(400).json({"reason":"No existe usuario asociado a este número de cédula"});
                }
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
        })
})

module.exports = api;
