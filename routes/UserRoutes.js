const router = require('express').Router();
const UserController = require('../controllers/UserController');

const verifyToken = require('../helpers/verifyToken');
const { imageUpload } = require('../helpers/imageUpload');

router.get('/', UserController.getAllUsers);
router.get('/checkUser', UserController.checkUser);
router.post('/login', UserController.login);
router.post('/register', UserController.UserController);
router.get('/:id', UserController.getUserById);
router.patch(
    '/edit/:id',
    verifyToken,
    imageUpload.single('image'),
    UserController.editUser
);

module.exports = router;
