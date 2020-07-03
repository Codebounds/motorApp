const persona = require('./Persona/persona');


persona.listen(3000, '0.0.0.0', () => {
    console.log('listening to persona');
})