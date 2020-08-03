'use strict';


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


const fichaSchema = new mongoose.Schema({
    cedula: String,
    marca: String,
    modelo: String,
    color: String,
    placa: String,
    kilometraje: String,
    fechaIngreso: String,
    horaIngreso: String,
    tecnicoCedula: String,
    tecnicoNombre: String,
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

  const reparacionesSchema = new mongoose.Schema({
    orden: String,
    nombre: String,
    costo: String,
    prioridad: String,//BAJA - MEDIA - ALTA
    estadoTaller: String, //NO DEFINIDO - COMPRADO - POR COMPRAR
    estadoCliente: String,//NO DEFINIDO - ACEPTADO - RECHAZADO
    lugar: String//NO DEFINIDO - TALLER - TIENDA
});

const accesoriosSchema = new mongoose.Schema({
    nombre: String
});

const repuestosSchema = new mongoose.Schema({
    nombre: String
});


module.exports = {reparacionesSchema, fichaSchema, personaSchema, accesoriosSchema, repuestosSchema, uri}