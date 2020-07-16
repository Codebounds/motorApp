'use strict';

const express = require('express');
const api = express.Router();
const bodyParser = require('body-parser');
const mongo = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const { MongoNetworkError } = require('mongodb');

const uri = 'mongodb+srv://admin:admin@motorapp.4hjcl.mongodb.net/MotorApp?retryWrites=true&w=majority';

api.use(bodyParser.urlencoded({extended: false}));

api.post('/saveFicha', (req, res) =>{
    res.json({"status":"200"});
});

module.exports = api;