const persona = require('./Persona/persona');
const PORT = process.env.PORT || 5000


persona.listen(PORT, '0.0.0.0', () => {
    console.log('listening to persona');
})