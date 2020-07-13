'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');
const error = require('../Helper/Errors');

const uri = 'mongodb+srv://admin:admin@motorapp.4hjcl.mongodb.net/MotorApp?retryWrites=true&w=majority';


const personaSchema = new mongoose.Schema({
    cedula: String,
    nombre: String,
    pass: String,
    telefono: String,
    email: String,
    direccion: String,
    ciudad: String,
    tipo: String
  });  


api.use(bodyParser.urlencoded({extended: false}));

api.post('/savePersona', (req, res) =>{

    var cedula = req.body.cedula;
    var nombre = req.body.nombre;
    var telefono = req.body.telefono;
    var email = req.body.email;
    var direccion = req.body.direccion;
    var ciudad = req.body.ciudad;
    var tipo = req.body.tipo;

    if(cedula == "" || cedula == null){
        res.json(error.getError("El parametro cedula es obligatorio")).status(400)
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            console.log("successful connection!");
            const Persona = mongoose.model('Persona', personaSchema);
            const nuevaPersona = new Persona({ 
                cedula: cedula,
                nombre: nombre,
                telefono: telefono,
                email: email,
                direccion: direccion,
                ciudad: ciudad,
                tipo: tipo
            });
            nuevaPersona.save().then(doc => {
                res.json().status(200);
            })
            .catch(err => {
                res.json({"reason":"Error interno, vuelva a intentarlo"}).status(500);
            })
        })
        .catch(err => {
            res.json({"reason":"Error en conexión a base de datos"}).status(500);
        })
    }

    
});

api.get('/getAllPersonas', (req, res) =>{
    mongoose.connect(uri, {useNewUrlParser: true})
    .then(() => {
        const Persona = mongoose.model('Persona', personaSchema);
        Persona.find()
          .then(doc => {
            var respuesta = {
                "data": doc
            };
            res.json({respuesta}).status(200);
          })
          .catch(err => {
            res.json({"reason":"Error interno, vuelva a intentalo"}).status(500);
          })
    })
    .catch(err => {
        res.json({"reason":"Error en conexión a base de datos"}).status(500);
    });
})

api.post('/getPersonaFromCedula', (req, res) =>{

    var cedula = req.body.cedula;
    if(cedula == "" || cedula == null){
        res.json({"reason":"El parametro cedula es obligatorio"}).status(400)
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.find({
                cedula: cedula
            })
            .then(doc => {
                if (doc.length > 0){
                    var respuesta = {
                        "data": doc
                    };
                    res.json({respuesta}).status(200);
                }else {
                    res.json({"reason":"No hay usua"})
                }
            })
            .catch(err => {
            res.json({"reason":"Error interno, vuelva a intentarlo"}).status(500);
            })
        })
        .catch(err => {
            res.json({"reason":"Error en conexión a base de datos"}).status(500);
        });
    }
})

api.post('/getPersonasFromTipo', (req, res) => {
    var tipo = req.body.tipo;
    if(tipo == "" || tipo == null){
        res.json({"reason":"El parametro tipo es obligatorio"}).status(400);
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.find({
                tipo: tipo
            })
            .then(doc => {
            var respuesta = {
                "data": doc
            };
            res.json({respuesta}).status(200);
            })
            .catch(err => {
            res.json({"reason":"Error interno, vuelva a intentarlo"}).status(500);
            })
        })
        .catch(err => {
            res.json({"reason":"Error en conexión a base de datos"}).status(500);
        });
    }
});

api.post('/doLogin', (req, res) => {
    var cedula = req.body.cedula;
    var pass = req.body.pass;
    if (cedula == "" || cedula == null){
        res.json({"reason":"El parametro cedula es obligatorio"}).status(400);
    }else if (pass == "" || pass == null){
        res.json({"resaon":"El parametro pass es obligatorio"}).status(400);
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.find({
                cedula: cedula,
                pass: pass
            })
            .then(doc => {
                if (doc.length > 0) {
                    var respuesta = {
                        "data": doc
                    };
                    res.json({respuesta})-status(200);
                }else {
                    res.json({"reason":"Usuario/contraseña incorrectos"}).status(400);
                }
            })
            .catch(err => {
                res.json({"reason":"Error interno, vuelva a intentarlo"}).status(500);
            })
        })
        .catch(err => {
            res.json({"reason":"Error en conexión a base de datos"}).status(500);
        })
    }
});

module.exports = api;