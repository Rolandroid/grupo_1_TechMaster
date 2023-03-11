const multer = require('multer');
const path = require('path');

const storageProductImages = multer.diskStorage({
    destination : function (req,file,callback) {
        callback(null, 'public/images/users')
    },
    filename : function (req,file,callback) {
        callback(null,`${Date.now()}_products_${path.extname(file.originalname)}`)
    }
});

const uploadProductImagesUser = multer({
    storage : storageProductImages
});

module.exports = {
    uploadProductImagesUser
}