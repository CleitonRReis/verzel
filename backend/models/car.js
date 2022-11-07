const mongoose = require('mongoose');
const { Schema } = mongoose;

const CarSchema = new Schema({
    marca : {
        type : String,
        require : true
    },
    name : {
        type : String,
        require : true,
    },
    images : {
        type : Array,
        require : true
    },
    model : {
        type : String,
        require : true
    },
    price : {
        type : String
    },
    year : {
        type : Number
    }
}, { timestamp : true });

const CarModel = mongoose.model('CarSchema', CarSchema);

module.exports = CarModel;
