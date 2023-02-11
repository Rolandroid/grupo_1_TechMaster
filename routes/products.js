const express = require('express');
const router = express.Router();

const {detalle,list,creacion,edicion} = require('../controllers/productController')

router
.get('/detalle/:id',detalle)
.get('/list',list)
.get('/creacion',creacion)
.get('/edicion',edicion)



module.exports = router;
