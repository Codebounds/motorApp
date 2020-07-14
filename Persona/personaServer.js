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
        res.status(400).json(error.getError("El parametro cedula es obligatorio"))
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
                res.status(200).json();
            })
            .catch(err => {
                res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
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
            res.status(200).json({respuesta});
          })
          .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentalo"});
          })
    })
    .catch(err => {
        res.status(500).json({"reason":"Error en conexión a base de datos"});
    });
})

api.post('/getPersonaFromCedula', (req, res) =>{

    var cedula = req.body.cedula;
    if(cedula == "" || cedula == null){
        res.status(400).json({"reason":"El parametro cedula es obligatorio"});
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.findOne({
                cedula: cedula
            }, function(err, persona){
                if (!err){
                    res.status(200).json({persona});
                } else {
                    res.status(400).json({"reason":"No existe usuario asociado a este número de cédula"});
                }
            })
            .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        });
    }
})

api.post('/getPersonasFromTipo', (req, res) => {
    var tipo = req.body.tipo;
    if(tipo == "" || tipo == null){
        res.status(400).json({"reason":"El parametro tipo es obligatorio"});
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
            res.status(200).json({respuesta});
            })
            .catch(err => {
            res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        });
    }
});

api.post('/registro', (req, res) => {
    var cedula = req.body.cedula;
    var pass = req.body.pass;
    if (cedula == "" || cedula == null){
        res.status(400).json({"reason":"El parametro cedula es obligatorio"});
    } else if (pass == "" || pass == null){
        res.status(400).json({"reason":"El parametro pass es obligatorio"});
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.findOne({
                cedula: cedula
            }, function(err, persona){
                if(!err){
                    persona.pass = pass
                    persona.save().then(doc => {
                        res.status(200).json({doc});
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
    }
});

api.post('/doLogin', (req, res) => {
    var cedula = req.body.cedula;
    var pass = req.body.pass;
    if (cedula == "" || cedula == null){
        res.status(400).json({"reason":"El parametro cedula es obligatorio"});
    }else if (pass == "" || pass == null){
        res.status(400).json({"resaon":"El parametro pass es obligatorio"});
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.findOne({
                cedula: cedula,
                pass: pass
            }, function(err, persona){
                if(persona != null){
                    res.status(200).json({persona});
                } else {
                    res.status(400).json({"reason":"Usuario/contraseña incorrectos"});
                }
            })
            .catch(err => {
                res.status(500).json({"reason":"Error interno, vuelva a intentarlo"});
            })
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        })
    }
});

module.exports = api;