const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true,
        lowercase : true
    },
    password : {
        type : String,
        require : true
    },
    image : {
        type : String
    },
}, { timestamps : true });

const UserModel = mongoose.model('UserSchema', UserSchema);

module.exports = UserModel;
