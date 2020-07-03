'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');

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
        var respuesta = {
            "state":"400",
            "reason":"El parametro cedula es obligatorio"
        }
        res.json({respuesta})
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
                var respuesta = {
                    "state": "200"
                };
                res.json({respuesta});
            })
            .catch(err => {
                var respuesta = {
                    "state": "400"
                };
                res.json({respuesta});
            })
        })
        .catch(err => {
            console.error('Database connection error')
            var respuesta = {
                "state": "404"
            };
            res.json({respuesta});
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
                "state": "200",
                "data": doc
            };
            res.json({respuesta});
          })
          .catch(err => {
            var respuesta = {
                "state": "404"
            };
            res.json({respuesta});
          })
    })
    .catch(err => {

    });
})

api.get('/getPersonaFromCedula', (req, res) =>{

    var cedula = req.body.cedula;
    if(cedula == "" || cedula == null){
        var respuesta = {
            "status":"500",
            "reason":"El parametro cedula es obligatorio"
        }
        res.json({respuesta})
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.find({
                cedula: cedula
            })
            .then(doc => {
            var respuesta = {
                "state": "200",
                "data": doc
            };
            res.json({respuesta});
            })
            .catch(err => {
            var respuesta = {
                "state": "404"
            };
            res.json({respuesta});
            })
        })
        .catch(err => {
    
        });
    }
})

api.get('/getPersonasFromTipo', (req, res) => {
    var tipo = req.body.tipo;
    if(tipo == "" || tipo == null){
        var respuesta = {
            "status":"500",
            "reason":"El parametro tipo es obligatorio"
        }
        res.json({respuesta})
    } else {
        mongoose.connect(uri, {useNewUrlParser: true})
        .then(() => {
            const Persona = mongoose.model('Persona', personaSchema);
            Persona.find({
                tipo: tipo
            })
            .then(doc => {
            var respuesta = {
                "state": "200",
                "data": doc
            };
            res.json({respuesta});
            })
            .catch(err => {
            var respuesta = {
                "state": "404"
            };
            res.json({respuesta});
            })
        })
        .catch(err => {
    
        });
    }
});

module.exports = api;