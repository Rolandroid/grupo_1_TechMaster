const express = require('express');
const router = express.Router();

const {detalle,list,creacion,edicion,create,update,remove} = require('../controllers/productController');
const { uploadProductImages } = require('../middlewares/upload');

router
.get('/detalle/:id',detalle)
.get('/list',list)
.get('/creacion',creacion)
.post('/creacion',uploadProductImages.array("images"),create)
.get('/edicion/:id',edicion)
.put('/update/:id',uploadProductImages.array("images"),update)
.delete('/remove/:id',remove)



module.exports = router;
