const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const getUserByToken = async (token) => {
    try {
        if (!token) {
            return res.status(401).json({
                error : 'Não foi possível validar o token de acesso!'
            });
        }

        const decodedToken = jwt.verify(token, 'mysecret');
        const userId = decodedToken.id;
        const user = UserModel.findOne({ _id : userId });
    
        return user;
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Não foi possível validar o token!'
        })
    }
}

module.exports = getUserByToken;
