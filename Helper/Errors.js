'use strict';


/*
  400 -> Bad request
  500 -> Server error  

*/

function getError(mensaje){
    return {"mensaje": mensaje }
};


module.exports.getError = getError;