const mongoose = require('mongoose');

async function conectarMongoDB() {
    await mongoose.connect('mongodb://localhost/DBverzelCars');
    console.log('Banco conectado!');
}

conectarMongoDB().catch((error) => console.error(error));

module.exports = conectarMongoDB;
