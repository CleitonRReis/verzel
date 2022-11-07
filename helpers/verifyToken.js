const jwt = require('jsonwebtoken');
const getToken = require('./getToken');

const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({
                message : 'Acesso negado!'
            });
        }
        
        const token = getToken(req);
    
        if (!token) {
            return res.status(401).json({
                messagem : 'Acesso negado!'
            })
        }

        const verified = jwt.verify(token, 'mysecret');
        req.user = verified;

        next();
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : 'Não foi possível validar o token de acesso!'
        });
    }

}

module.exports = verifyToken;
