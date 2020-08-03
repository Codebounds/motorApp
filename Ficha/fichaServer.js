'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');
const server = require('../Helper/BaseServe');


//api.use(bodyParser.urlencoded({extended: false}));
api.use(bodyParser.json({limit: '50mb'}));
api.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



api.post('/saveVehiculo', (req,res) => {
    var cedula = req.body.cedula;
    var marca = req.body.marca;
    var modelo = req.body.modelo;
    var color = req.body.color;
    var placa = req.body.placa;
    var kilometraje = req.body.kilometraje;


    if (cedula == "" || cedula == null){
        res.status(401).json({"reason":"El parametro cedula es obligatorio"});
    }
    if (placa == "" || placa == null){
        res.status(401).json({"reason":"El parametro placa es obligatorio"});
    }

    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
            const nuevaFicha = new Ficha({ 
                cedula: cedula,
                marca: marca,
                modelo: modelo,
                color: color,
                placa: placa,
                kilometraje: kilometraje,
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

})

api.post('/saveFicha', (req, res) =>{
    var orden = req.body.orden;
    var fechaIngreso = req.body.fechaIngreso;
    var horaIngreso = req.body.horaIngreso;
    var tecnicoCedula = req.body.tecnicoCedula;
    var tecnicoNombre = req.body.tecnicoNombre;
    var fechaEntrega = req.body.fechaEntrega;
    var horaEntrega = req.body.horaEntrega;
    var gasolina = req.body.gasolina;
    var imagenIzquierda = req.body.imagenIzquierda;
    var imagenDerecha = req.body.imagenDerecha;
    var imagenFrente = req.body.imagenFrente;
    var imagenPosterior = req.body.imagenPosterior;
    var accesorios = req.body.accesorios;

    mongoose.connect(sever.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            console.log("successful connection!");
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
            Ficha.findOne({
                orden: orden
            }, function(err, ficha){
                if(ficha != null){
                    ficha.fechaIngreso = fechaIngreso;
                    ficha.horaIngreso = horaIngreso
                    ficha.tecnicoCedula = tecnicoCedula;
                    ficha.tecnicoNombre = tecnicoNombre;
                    ficha.fechaEntrega = fechaEntrega;
                    ficha.horaEntrega = horaEntrega;
                    ficha.gasolina = gasolina;
                    ficha.imagenIzquierda = imagenIzquierda;
                    ficha.imagenDerecha = imagenDerecha;
                    ficha.imagenFrente = imagenFrente;
                    ficha.imagenPosterior = imagenPosterior;
                    ficha.accesorios = accesorios;
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
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        })
});

api.post('/getHistorial', (req,res) => {
    var cedula = req.body.cedula;
    if (cedula == "" || cedula == null){
        res.status(401).json({"reason":"El parámetro cedula es obligatorio"});
    }
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', server.fichaSchema);
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

api.post('/getFichasFromCedula', (req,res) => {
    var cedula = req.body.cedula;
    if (cedula == "" || cedula == null){
        res.status(401).json({"reason":"El parámetro cedula es obligatorio"});
        return;
    }
    mongoose.connect(sever.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', server.fichaSchema);
        Ficha.find({
            cedula: cedula
        })
        .then(fichas => {
            if (fichas.length > 0){
                res.status(200).json({fichas});
            } else {
                res.status(400).json({"reason":"No hay fichas para esta cedula"});
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

//ENUM ESTADO -> 'ALL' - 'ACTUAL'
api.post('/getFichasFromPlaca', (req,res) => {
    var placa = req.body.placa;
    var estado = req.body.placa;
    var busquedaEstado = []
    if (placa == "" || placa == null){
        res.status(401).json({"reason":"El parámetro placa es obligatorio"});
        return;
    }
    if(estado == "" || estado == null || estado == "ALL"){
        busquedaEstado = ['INGRESO', 'REPARACION', 'RECORRIDO', "LISTO"];
    } else {
        busquedaEstado = ['INGRESO', 'REPARACION', 'RECORRIDO']
    }
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', server.fichaSchema);
        Ficha.find({
            placa: placa,
            estado: {$in: busquedaEstado}
        })
        .then(fichas => {
            if (fichas.length > 0){
                res.status(200).json({fichas});
            } else {
                res.status(400).json({"reason":"No hay fichas para esta cedula"});
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
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("successful connection!");
        const Ficha = mongoose.model('Ficha', server.fichaSchema);
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

api.post('/getFichasFromTecnicoParaDefinir', async(req, res) => {
    console.log('getfichasfromtecnicoparadefinir')
    var tecnicoCedula = req.body.tecnicoCedula;
    if (tecnicoCedula == "" || tecnicoCedula == null){
        res.status(401).json({"reason":"El parametro tecnicoCedula es obligatorio"});
    }
    var fichasParaDefinirTecnico = []
    try{
        mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(async(app) => {
            console.log('success conection')
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
            const fichas = await Ficha.find().where("tecnicoCedula").in([tecnicoCedula]).exec()
            for(var i=0;i<fichas.length;i++){
                const reparacion = await Reparacion.find().where("orden").in([fichas[i].orden]).exec()
                if (reparacion.length == 0){
                    fichasParaDefinirTecnico.push(fichas[i])
                }
            }
            console.log("Fichas para definir: " + fichasParaDefinirTecnico)
            if (fichasParaDefinirTecnico.length > 0){
                res.status(200).json({fichasParaDefinirTecnico});
            } else {
                res.status(400).json({"reason":"Este tecnico no tiene fichas para definir"})
            }
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en conexión a base de datos"});
        });
    }catch(error){
        res.json({error})
    }
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
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
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
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
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
});

api.post('/getFichasReparacionCosto', async(req,res) => {
    var fichasParaDefinirCosto = []
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(async(app) => {
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
            var fichas = await Ficha.find().exec();
            for(var i=0;i<fichas.length;i++){
                var reparaciones = await Reparacion.find({
                    orden: fichas[i].orden,
                    costo: "NO DEFINIDO"}).exec();
                if(reparaciones.length > 0){
                    fichasParaDefinirCosto.push(fichas[i])
                }
            }
            if (fichasParaDefinirCosto.length > 0){
                res.status(200).json({fichasParaDefinirCosto});
            } else {
                res.status(400).json({"reason":"No hay fichas para definir su costo"});
            }
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en la conexión a la base de datos"})
        })
});

api.post('/getFichasReparacionEstadoTaller', async(req,res) => {
    var fichasParaDifinirEstadoTaller = []
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(async(app) => {
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
            const Reparacion = mongoose.model('Reparacion', server.reparacionesSchema);
            var fichas = await Ficha.find().exec();
            for(var i=0;i<fichas.length;i++){
                var reparaciones = await Reparacion.find({
                    ordne: fichas[i].orden,
                    estadoTaller: {$in: ['NO DEFINIDO', 'POR COMPRAR']},
                    estadoCliente: "APROBADO"
                }).exec()
                if(reparaciones.length > 0){
                    fichasParaDifinirEstadoTaller.push(fichas[i])
                }
            }
            if (fichasParaDifinirEstadoTaller.length > 0){
                res.status(200).json({fichasParaDifinirEstadoTaller});
            } else {
                res.status(400).json({"reason":"No hay fichas para definir su estadoTaller"});
            }
        })
        .catch(err => {
            res.status(500).json({"reason":"Error en la conexión a la base de datos"})
        })
});

api.post('/saveDiagnostico', (req,res) => {
    var orden = req.body.orden;
    var diagnostico = req.body.diagnostico;
    
    if(orden == "" || orden == null){
        res.status(401).json({"reason":"El parametro orden es obligatorio"})
    }
    if(diagnostico == "" || diagnostico == null){
        res.status(401).json({"reason":"El parametro diagnostico es obligatorio"});
    }
    mongoose.connect(server.uri, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
            const Ficha = mongoose.model('Ficha', server.fichaSchema);
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


module.exports = api;