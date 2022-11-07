const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const getToken = require('../helpers/getToken');
const conectarMongoDB = require('../db/conectarMongo');
const getUserByToken = require('../helpers/getUserByToken');
const createUserToken = require('../helpers/createUserToken');

const UserController = async (req, res) => {
    try {
        const { name, email, password, confirmpassword } = req.body;
    
        if (!name || name.length < 2) {
            return res.status(400).json({
                message : 'O nome é obrigatório! E deve conter, pelo menos, dois caracteres!'
            });
        }
    
        if (!email || !email.includes('@') || !email.includes('.com')) {
            return res.status(400).json({
                message : 'Email inválido. Use o seguinte formato - teste@teste.com'
            });
        }
    
        if (!password) {
            return res.status(400).json({
                message : 'A senha é obrigatória!'
            });
        }
    
        if (!confirmpassword) {
            return res.status(400).json({
                message : 'A confirmação de senha é obrigatório!'
            });
        }
    
        if (password !== confirmpassword) {
            return res.status(400).json({
                message : 'A confirmação de senha não confere!'
            });
        }
    
        const userExists = await UserModel.find({
            email : email
        });
    
        if (userExists && userExists.length > 0) {
            return res.status(400).json({
                message : 'Já existe um usuário com este email. Utilize outro email!'
            });
        }
    
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
    
        const user = new UserModel({
            name,
            email,
            password: passwordHash
        });
    
        const newUser = await user.save();
        await createUserToken(newUser, req, res);
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message : 'Houve um erro ao criar o usuário!'
        });
    }

}

const getAllUsers = async (_req, res) => {
    try {
        const users = await UserModel.find();
        return res.status(200).json(users);
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            message : 'Não foi possível buscar os usuários!'
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message : 'Email é obrigatório!'
            });
        }

        if (!password) {
            return res.status(400).json({
                message : 'Senha é obrigatória!'
            });
        }

        const user = await UserModel.findOne({
            email : email
        });

        if (!user) {
            return res.status(400).json({
                message : 'Nenhum usuário encontrado com o email informado!'
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message : 'Usuário ou senha inválidos.'
            });
        }

        await createUserToken(user, req, res);
    } catch(error) {
        console.error(error);
        return res.status(400).json({
            message : 'Não foi possível efetuar o login!'
        });
    }
}

const checkUser = async (req, res) => {
    let currentUser;
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            error : 'Não foi possível validar o token de acesso!'
        });
    }

    const token = getToken(req);
    if (!token) {
        return res.status(401).json({
            error : 'Não foi possível validar o token de acesso!'
        });
    }

    const decodedToken = jwt.verify(token, 'mysecret');
    if (!decodedToken) {
        return res.status(401).json({
            error : 'Não foi possível validar o token de acesso!'
        });
    }

    currentUser = await UserModel.findById(decodedToken.id).select('-password');

    return res.status(200).json({
        message : 'Usuário autenticado com sucesso!',
        currentUser
    });
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(404).json({
                error : 'Usuário não encontrado!'
            });
        }

        const user = await UserModel.findById(id).select('-password');
        return res.status(200).json({ user });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Houve um erro ao buscar o usuário!'
        })
    }
}

const editUser = async (req, res) => {
    try {
        const token = getToken(req);
        const user = await getUserByToken(token);
        const { name, email, password, confirmpassword } = req.body;

        if (req.file) {
            user.image = req.file.originalname;
        }

        if (!name || name.length < 2) {
            return res.status(400).json({
                error : 'Nome inválido! Deve conter, pelo menos, 2 carcteres!'
            });
        }
    
        user.name = name;
        
        if (!email || !email.includes('@') || !email.includes('.com')) {
            return res.status(400).json({
                error : 'Email inválido. Use o seguinte formato - teste@teste.com'
            });
        }
    
        const userExists = await UserModel.findOne({
            email : email
        });
    
        if (user.email !== email && userExists) {
            res.status(400).json({
                error : 'Usuário já cadastrado com este email.'
            });
        }
    
        user.email = email;

        await UserModel.findOneAndUpdate(
            { _id : user._id },
            { $set : user },
            { new : true }
        );
    
        return res.status(200).json({
            message : 'Usuário atualizado com sucesso!'
        });

        // if (!password) {
        //     return res.status(400).json({
        //         error : 'Senha é obrigatória!'
        //     });
        // }
    
        // if (!confirmpassword) {
        //     return res.status(400).json({
        //         error : 'Confirmação de senha é obrigatória!'
        //     });
        // }
    
        // if (password !== confirmpassword) {
        //     return res.status(400).json({
        //         message : 'A confirmação de senha não confere!'
        //     });
        // }
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Não foi possível atualizar o(s) dado(s) do usuário!'
        });
    }
}

module.exports = {
    UserController, 
    getAllUsers,
    login,
    checkUser,
    getUserById,
    editUser
};
