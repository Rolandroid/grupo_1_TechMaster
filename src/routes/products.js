const express = require('express');
const router = express.Router();

const {detalle,list,creacion,edicion,create,update,remove} = require('../controllers/productController');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const { uploadProductImages } = require('../middlewares/upload');
const productCreateValidator = require('../validations/productCreateValidator');
const productEditValidator = require('../validations/productEditValidator');

router
.get('/detalle/:id',detalle)
.get('/list',list)
.get('/creacion',checkUserAdmin,creacion)
.post('/creacion',uploadProductImages.array("images"),productCreateValidator,create)
.get('/edicion/:id',checkUserAdmin,edicion)
.put('/edicion/:id',uploadProductImages.array("images"),productEditValidator,update)
.delete('/remove/:id',remove)



module.exports = router;
