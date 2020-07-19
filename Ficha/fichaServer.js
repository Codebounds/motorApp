'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@motorapp.4hjcl.mongodb.net/MotorApp?retryWrites=true&w=majority';

api.use(bodyParser.urlencoded({extended: false}));

const fichaSchema = new mongoose.Schema({
    cedula: String,
    marca: String,
    color: String,
    placa: String,
    kilometraje: String,
    fechaIngreso: String,
    horaingreso: String,
    tecnico: String,
    fechaEntrega: String,
    horaEntrega: String,
    gasolina: String,
    imagenIzquierda: String,
    imagenDerecha: String,
    imagenFrente: String,
    imagenPosterior: String,
    accesorios: String,
    diagnostico: String,
    estado: String,
    orden: String
  });

api.post('/saveFicha', (req, res) =>{
    var cedula = req.body.cedula;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var color = req.body.color;
    var placa = req.body.placa;
    var kilometraje = req.body.kilometraje;
    var fechaIngreso = req.body.fechaIngreso;
    var horaingreso = req.body.horaingreso;
    var tecnico = req.body.tecnico;
    var fechaEntrega = req.body.fechaEntrega;
    var horaEntrega = req.body.horaEntrega;
    var gasolina = req.body.gasolina;
    var imagenIzquierda = req.body.imagenIzquierda;
    var imagenDerecha = req.body.imagenDerecha;
    var imagenFrente = req.body.imagenFrente;
    var imagenPosterior = req.body.imagenPosterior;
    var accesorios = req.body.accesorios;

    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Ficha = mongoose.model('Ficha', fichaSchema);
            const nuevaFicha = new Ficha({ 
                cedula: cedula,
                marca: marca,
                modelo: modelo,
                color: color,
                placa: placa,
                kilometraje: kilometraje,
                fechaIngreso: fechaIngreso,
                horaingreso: horaingreso,
                tecnico: tecnico,
                fechaEntrega: fechaEntrega,
                horaEntrega: horaEntrega,
                gasolina: gasolina,
                imagenIzquierda: imagenIzquierda,
                imagenDerecha: imagenDerecha,
                imagenFrente: imagenFrente,
                imagenPosterior: imagenPosterior,
                accesorios: accesorios,
                estado: "INGRESO",
                orden: Date.now()

            });
            nuevaFicha.save().then(doc => {
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

api.post('/getHistorial', (req,res) => {
    var cedula = req.body.cedula;
    if (cedula == "" || cedula == null){
        res.status(401).json({"reason":"El parámetro cedula es obligatorio"});
    }
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', fichaSchema);
        Ficha.find({
            cedula: cedula,
            estado: "LISTO"
        })
        .then(historial => {
            if (historial.length > 0){
                res.status(200).json({historial});
            } else {
                res.status(400).json({"reason":"No hay vehiculos reparados"});
            }
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en el servidor, vuelva a intentarlo"});
        })
    })
    .catch(err => {
        res.status(500).json({"reason":"Error en conexión a base de datos"})
    });
});

api.post('/getFichaActualFromCedula', (req,res) => {
    var cedula = req.body.cedula;
    if (cedula == "" || cedula == null){
        res.status(401).json({"reason":"El parámetro cedula es obligatorio"});
    }
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', fichaSchema);
        Ficha.findOne({
            cedula: cedula,
            estado: {$in: ['INGRESO', 'REPARACION', 'RECORRIDO']}
        }, function(err, ficha){
            if (ficha != null){
                res.status(200).json({ficha});
            } else {
                res.status(400).json({"reason":"No hay vehiculos en el taller"});
            }
        })
    })
    .catch(err => {
        res.status(500).json({"reason":"Error en conexión a base de datos"})
    });
    
});

api.post('/getFichasFromTecnico', (req, res) => {
    var tecnico = req.body.tecnico;
    if (tecnico == "" || tecnico == null){
        res.status(400).json({"reason":"El parametro tecnico es obligatorio"});
    }
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        const Ficha = mongoose.model('Ficha', fichaSchema);
        Ficha.find({
            tecnico: tecnico
        })
        .then(doc => {
        var respuesta = {
            "data": doc
        };
        res.status(200).json({respuesta});
        })
        .catch(err => {
        res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
        })
    })
    .catch(err => {
        res.status(500).json({"reason":"Error en conexión a base de datos"});
    });

});

api.post('/saveDiagnostico', (req,res) => {
    var orden = req.body.orden;
    var diagnostico = req.body.diagnostico;
    if (diagnostico == "" || diagnostico == null){
        res.status(400).json({"reason":"El parametro diagnostico es obligatorio"});
    }
    if (orden == "" || orden == null){
        res.status(400).json({"reason":"El parametro orden es obligatorio"});
    }
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Ficha = mongoose.model('Ficha', fichaSchema);
            Ficha.findOne({
                orden: orden
            }, function(err, ficha){
                if(ficha != null){
                    ficha.diagnostico = diagnostico
                    ficha.save().then(ficha => {
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

api.post('/saveEstadoDelVehiculo', (req,res) => {
    var orden = req.body.orden;
    var estado = req.body.estado;
    if (estado == "" || estado == null){
        res.status(400).json({"reason":"El parametro estado es obligatorio"});
    }
    if (orden == "" || orden == null){
        res.status(400).json({"reason":"El parametro orden es obligatorio"});
    }
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Ficha = mongoose.model('Ficha', fichaSchema);
            Ficha.findOne({
                orden: orden
            }, function(err, ficha){
                if(ficha != null){
                    ficha.estado = estado
                    ficha.save().then(ficha => {
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