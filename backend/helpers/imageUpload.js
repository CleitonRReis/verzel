const path = require('path');
const multer = require('multer');

const imageStorage = multer.diskStorage({
    destination : function (req, file, cb) {
        let folder = '';

        if (req.baseUrl && req.baseUrl.includes('users')) {
            folder = 'users';
        } else {
            folder = 'cars';
        }

        cb(null, `public/images/${ folder }`);
    },
    filename : function (_req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname));
    },
});

const imageUpload = multer({
    storage : imageStorage,
    fileFilter(_req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            cb(new Error('Por favor, a imagem deve estar em um dos seguintes formatos: png, jpg ou jpeg!'));
        }
        cb(undefined, true);
    }
});

module.exports = { imageUpload };
