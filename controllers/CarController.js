const CarModel = require('../models/car');
const ObjectId = require('mongoose').Types.ObjectId;
const conectarMongo = require('../db/conectarMongo');

const Car = async (req, res) => {
    try {
        const { name, marca, model, price, year } = req.body;
        
        if (!name || name.length < 2) {
            return res.status(400).json({
                error : 'O nome do veículo é obrigatório e deve conter, pelo menos, dois caracteres!'
            });
        }
        
        if (!marca || marca.length < 3) {
            return res.status(400).json({
                error : 'A marca do veículo é obrigatória e deve conter, pelo menos, três caracteres!'
            });
        }
        
        if (!model || model.length < 3) {
            return res.status(400).json({
                error : 'O modelo do veículo é obrigatório e deve conter, pelo menos, três caracteres!'
            });
        }

        if (price) {
            CarModel.price = price;
        }

        if (year) {
            CarModel.year = year;
        }

        const images = req.files;

        if (!images || images.length === 0) {
            return res.status(400).json({
                error : 'Adicione, pelo menos, uma imagem!'
            });
        }

        const car = new CarModel({
            name,
            marca,
            model,
            price,
            year,
            images : []
        });

        
        images.map(image => {
            car.images.push(image.filename);
        });
        
        const newCar = await car.save();
        return res.status(201).json({
            message : 'Anúncio criado com sucesso!' ,
            newCar
        });
        
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Não foi possível criar o anúncio!'
        });
    }
}

const getAllCars = async (_req, res) => {
    try {
        const cars = await CarModel.find().sort({ price : -1 });
        return res.status(200).json(cars);
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Desculpe! Não foi possível buscar os carros!'
        });
    }
}

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error : 'Id inválido!'
            });
        }
        
        const carData = await CarModel.findById({
            _id : id
        });

        if (!carData) {
            return res.status(404).json({
                error : 'Veículo não encontrado!'
            });
        }
        
        return res.status(200).json(carData);
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Não foi possível obter os dados do veículo!'
        });
    }
}

const editCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, name, model, price, year } = req.body;
        const images = req.files;
        const updateData = {};
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error : 'Id inválido!'
            });
        }

        const car = await CarModel.findById({
            _id : id
        });

        if (!car) {
            return res.status(404).json({
                error : 'Veículo não encontrado!'
            });
        }

        updateData.marca = marca;
        updateData.name = name;
        updateData.model = model;
        updateData.price = price;
        updateData.year = year;
        updateData.images = [];

        images.map(image => {
            updateData.images.push(image.filename);
        });

        await CarModel.findByIdAndUpdate(id, updateData);

        return res.status(200).json({
            message : 'Anúncio atualizado com sucesso!'
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Desculpe! Não foi possível atualizar os dados do anúncio!'
        });
    }
}

const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error : 'Id inválido!'
            });
        }

        const car = await CarModel.findById({
            _id : id
        });

        if (!car) {
            return res.status(404).json({
                error : 'Veículo não encontrado!'
            });
        }

        await CarModel.findByIdAndDelete({
            _id : id
        });

        return res.status(200).json({
            message : 'Anúncio excluído com sucesso!'
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error : 'Desculpe! Não foi possível remover o anúncio do veículo!'
        });
    }
}

module.exports = {
    getAllCars,
    Car,
    getCarById,
    editCar,
    deleteVehicle
};
