const router = require('express').Router();
const CarController = require('../controllers/CarController');

const verifyToken = require('../helpers/verifyToken');
const { imageUpload } = require('../helpers/imageUpload');

router.post(
    '/create',
    verifyToken,
    imageUpload.array('images'),
    CarController.Car
);

router.get('/', CarController.getAllCars);
router.get('/:id', CarController.getCarById);
router.delete('/:id', verifyToken, CarController.deleteVehicle);
router.patch('/edit/:id', verifyToken, imageUpload.array('images'), CarController.editCar);

module.exports = router;
