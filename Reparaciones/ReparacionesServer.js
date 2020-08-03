'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');
const server = require('../Helper/BaseServe');

api.use(bodyParser.urlencoded({extended: false}));



api.post('/saveRepuesto', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var prioridad = req.body.prioridad;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro repuesto es obligatorio"});
        return;
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
        return;
    }

    if (prioridad == "" || prioridad == null){
        res.status(401).json({"reason":"El parametro prioridad es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema); 
            const nuevaReparacion = new Reparacion({ 
                orden: orden,
                nombre: nombre,
                prioridad: prioridad,
                costo: "NO DEFINIDO",
                estadoTaller: "NO DEFINIDO",
                estadoCliente: "NO DEFINIDO",
                lugar: "NO DEFINIDO"
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

api.post('/getProforma', (req,res) => {
    var orden = req.body.orden;

    if (orden == null || orden == ""){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema)
            Reparacion.find({
                orden: orden
            })
            .then(reparaciones => {
                if (reparaciones.length > 0){
                    var reparacionSinDefinir = false;
                    for (var i=0;i<reparaciones.length;i++){
                        if(reparaciones[i].costo == "NO DEFINIDO"){
                            reparacionSinDefinir = true;
                            break;
                        }
                    }
                    if (reparacionSinDefinir == true){
                        res.status(400).json({"reason":"Las reparaciones están por definir"});
                    } else {
                        res.status(200).json({reparaciones});
                    }
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
        return;
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
        return;
    }

    if (estadoCliente == "" || estadoCliente == null){
        res.status(401).json({"reason":"El parametro estadoCliente es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
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
        return;
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
        return;
    }

    if (estadoTaller == "" || estadoTaller == null){
        res.status(401).json({"reason":"El parametro estadoTaller es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
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

api.post('/updateCosto', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var costo = req.body.costo;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
        return;
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
        return;
    }

    if (costo == "" || costo == null){
        res.status(401).json({"reason":"El parametro costo es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
            Reparacion.findOne({
                orden: orden,
                nombre: nombre
            }, function(err, repuesto){
                if(repuesto != null){
                    repuesto.costo = costo
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
});

api.post('/updateLugar', (req,res) => {
    var orden = req.body.orden;
    var nombre = req.body.nombre;
    var lugar = req.body.lugar;

    if (orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"});
        return;
    }

    if (nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"});
        return;
    }

    if (lugar == "" || lugar == null){
        res.status(401).json({"reason":"El parametro lugar es obligatorio"});
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
            Reparacion.findOne({
                orden: orden,
                nombre: nombre
            }, function(err, repuesto){
                if(repuesto != null){
                    repuesto.lugar = lugar
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
