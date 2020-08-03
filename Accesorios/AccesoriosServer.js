'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');
const server = require('../Helper/BaseServe');

api.use(bodyParser.urlencoded({extended: false}));


api.post('/ingresarAccesorio', (req, res) => {
    var nombre = req.body.nombre;
    
    if(nombre == "" || nombre == null){
        res.status(401).json({"reason":"El parametro nombre es obligatorio"})
        return;
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Accesorios = mongoose.model('Accesorios', server.accesoriosSchema); 
            const nuevoAccesorio = new Accesorios({ 
                nombre: nombre
            });
            nuevoAccesorio.save().then(accesorio => {
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

api.post('/getAllAccesorios', (req, res) => {
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Accesorios = mongoose.model('Accesorios', server.accesoriosSchema);
            Accesorios.find()
            .then(accesorios => {
                res.status(200).json({accesorios});
            })
            .catch(err => {
                res.status(500).json({"reason":"Error interno. Vuelva a intentarlo"})
            }) 
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexion a base de datos"})
        })
});

module.exports = api